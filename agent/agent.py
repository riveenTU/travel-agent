import os
import requests
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

MODEL = os.environ["GEMINI_MODEL"]
API_URL = os.environ.get("TOURS_API_URL", "http://localhost:4000")
MAX_STEPS = 5  # safety limit: stops the loop running (and costing) forever

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

CATEGORIES = ["cultural-triangle", "coast-beaches", "hill-country", "wildlife-nature"]


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

SYSTEM_PROMPT = """You are a trip-planning assistant for Ceylon Tours, a Sri Lanka tour company.
Rules:
- Always call search_tours before recommending anything.
- Only recommend tours returned by search_tours. Never invent tours, prices or details.
- When you recommend a tour, give its name and id.
- If nothing matches, or the tool returns an error, say so plainly.
"""

config = types.GenerateContentConfig(
    system_instruction=SYSTEM_PROMPT,
    tools=[types.Tool(function_declarations=[search_tours_declaration])],
)

TOOLS = {"search_tours": search_tours}


# ---------- The agent loop ----------

def run_agent(contents):
    for step in range(MAX_STEPS):
        response = client.models.generate_content(
            model=MODEL, contents=contents, config=config
        )
        # Keep the model's turn in the history (it needs to see what it asked for)
        contents.append(response.candidates[0].content)

        if not response.function_calls:
            return response.text or "(no reply)"  # plain text = finished

        parts = []
        for call in response.function_calls:
            args = dict(call.args or {})
            print(f"  [tool] {call.name}({args})")
            tool = TOOLS.get(call.name)
            result = tool(**args) if tool else {"error": f"Unknown tool {call.name}"}
            print(f"  [tool] -> {result.get('count', result.get('error'))}")
            parts.append(types.Part.from_function_response(name=call.name, response=result))

        # Send the tool results back as the next message
        contents.append(types.Content(role="user", parts=parts))

    return "Sorry, I couldn't finish planning that. Please try rephrasing."


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