import os
import re
import requests
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

MODEL = os.environ["GEMINI_MODEL"]
API_URL = os.environ.get("TOURS_API_URL", "http://localhost:4000")
MAX_STEPS = 8  # safety limit: stops the loop running (and costing) forever

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

CATEGORIES = ["cultural-triangle", "coast-beaches", "hill-country", "wildlife-nature"]

def parse_nights(duration):
    """Turn '3 nights / 4 days' into 3. Returns None if it can't tell."""

    if not duration:
        return None

    match = re.search(r"(\d+)\s*nights?", duration, re.IGNORECASE)

    if match:
        return int(match.group(1))

    match = re.search(r"(\d+)\s*days?", duration, re.IGNORECASE)
    if match:
        return max(int(match.group(1)) - 1, 0)  # '4 days' means 3 nights

    return None

# ---------- The tool: normal Python that calls your Express API ----------

def search_tours(category=None, month=None):
    params = {"category": category} if category else {}
    try:
        res = requests.get(f"{API_URL}/api/tours", params=params, timeout=5)
        res.raise_for_status()
        tours = res.json()
    except requests.RequestException as e:
        # Tell the model what went wrong instead of crashing
        return {"error": f"Tours API unavailable: {e}"}

    results = []
    for t in tours:
        months = t.get("availableMonths") or []
        # If a month was given and the tour lists its months, skip tours not offered then
        if month and months:
            wanted = month.strip().lower()[:3]
            if not any(m.lower()[:3] == wanted for m in months):
                continue
        location = t.get("location") or {}
        # Send only the fields the model needs: fewer tokens, less to get confused by
        results.append({
            "id": t["_id"],
            "name": t.get("name"),
            "category": t.get("category"),
            "duration": t.get("duration"),
            "price": f'{t.get("currency", "USD")} {t.get("price")}',
            "startCity": location.get("startCity"),
            "endCity": location.get("endCity"),
            "availableMonths": months or "not listed",
            "highlights": (t.get("highlights") or [])[:3],
        })
    return {"count": len(results), "tours": results}

def propose_plan(month, trip_days, stops):
    """Look up each proposed tour in the real data and work out the totals in code."""
    data = search_tours()  # published tours only: this is the source of truth

    if "error" in data:
        return {"ok": False, "errors": [data["error"]]}
    tours_by_id = {t["id"]: t for t in data["tours"]}

    plan_stops = []

    for stop in stops:
        tour = tours_by_id.get(stop.get("tour_id"))
        plan_stops.append({
            "tour_id": stop.get("tour_id"),
            "name": tour["name"] if tour else None,
            "nights": tour["nights"] if tour else None,
            "reason": stop.get("reason", "")
        })
    
    trip_days = int(trip_days)
    plan = {
        "month": month,
        "trip_days": trip_days,
        "trip_nights": trip_days - 1,
        "total_nights": sum(s["nights"] or 0 for s in plan_stops),
        "stops": plan_stops
    }

    return {"ok": True, "plan": plan}

# ---------- Describing the tool to the model ----------
# The model never sees the Python code, only this description.

search_tours_declaration = {
    "name": "search_tours",
    "description": (
        "Search Ceylon Tours' real tour packages in Sri Lanka. "
        "Returns only tours that exist in the database. "
        "Call with no arguments to get every tour."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "category": {
                "type": "string",
                "enum": CATEGORIES,
                "description": "Optional region/type filter.",
            },
            "month": {
                "type": "string",
                "description": "Optional travel month in English, e.g. 'February'.",
            },
        },
    },
}

propose_plan_declaration = {
    "name": "propose_plan",
    "description": (
        "Submit your final trip plan. Always use this instead of listing tours in text. "
        "The system checks the plan and replies with the result."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "month": {
                "type": "string",
                "description": "The travel month the user asked for, e.g. 'February'.",
            },
            "trip_days": {
                "type": "integer",
                "description": "The trip length in days that the user asked for.",
            },
            "stops": {
                "type": "array",
                "description": "The tours, in the order they would be done.",
                "items": {
                    "type": "object",
                    "properties": {
                        "tour_id": {"type": "string", "description": "id from search_tours"},
                        "reason": {"type": "string", "description": "One short line on why it fits."},
                    },
                    "required": ["tour_id", "reason"],
                },
            },
        },
        "required": ["month", "trip_days", "stops"],
    },
}

SYSTEM_PROMPT = """You are a trip-planning assistant for Ceylon Tours, a Sri Lanka tour company.
Rules:
- Always call search_tours before recommending anything.
- Only recommend tours returned by search_tours. Never invent tours, prices or details.
- To recommend tours, call propose_plan. Do not list tours in plain text.
- After propose_plan replies, write a short friendly summary for the user.
- If nothing matches, or a tool returns an error, say so plainly.
"""

config = types.GenerateContentConfig(
    system_instruction=SYSTEM_PROMPT,
    tools=[types.Tool(function_declarations=[search_tours_declaration, propose_plan_declaration])],
)

TOOLS = {"search_tours": search_tours, "propose_plan": propose_plan}

def summarise(result):
    """One short line for the [tool] log."""
    if "count" in result:
        return f"{result['count']} tours"
    if "ok" in result:
        return "plan ok" if result["ok"] else f"plan rejected: {result['errors']}"
    return result.get("error")    

# ---------- The agent loop ----------

def run_agent(contents):
    """Returns (reply_text, plan). plan is None if the model didn't make one."""
    plan = None
    for step in range(MAX_STEPS):
        response = client.models.generate_content(
            model=MODEL, contents=contents, config=config
        )
        # Keep the model's turn in the history (it needs to see what it asked for)
        contents.append(response.candidates[0].content)

        if not response.function_calls:
            return response.text or "(no reply)", plan  # plain text = finished

        parts = []
        for call in response.function_calls:
            args = dict(call.args or {})
            print(f"  [tool] {call.name}({args})")
            
            tool = TOOLS.get(call.name)
            result = tool(**args) if tool else {"error": f"Unknown tool {call.name}"}
            print(f"  [tool] -> {summarise(result)}")
            
            if call.name == "propose_plan" and result.get("ok"):
                plan = result["plan"]  # keep the version built by code
            
            parts.append(types.Part.from_function_response(name=call.name, response=result))

        # Send the tool results back as the next message
        contents.append(types.Content(role="user", parts=parts))

    return "Sorry, I couldn't finish planning that. Please try rephrasing.", plan



def main():
    print("Ceylon Tours trip planner. Type 'quit' to exit.\n")
    contents = []  # the whole conversation, so follow-ups keep their context
    while True:
        user = input("You: ").strip()
        if user.lower() in ("quit", "exit"):
            break
        if not user:
            continue
        contents.append(types.Content(role="user", parts=[types.Part(text=user)]))
        print(f"\nAgent: {run_agent(contents)}\n")


if __name__ == "__main__":
    main()