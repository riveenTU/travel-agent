import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

print("Flash models you can use:")

for m in client.models.list():
    if "flash" in m.name:
        print(" ", m.name)

model = os.environ.get("GEMINI_MODEL")
if model:
    response = client.models.generate_content(
        model=model,
        contents="In one sentence, what is Sigiriya?",
    )
    print("\nReply:", response.text)
    print("Tokens used:", response.usage_metadata.total_token_count)
else:
    print("\nAdd GEMINI_MODEL to .env using one of the names above, then run again.")