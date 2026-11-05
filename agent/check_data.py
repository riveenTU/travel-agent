from agent import search_tours, parse_nights

data = search_tours()
if "error" in data:
    print(data["error"])
    raise SystemExit(1)

for t in data["tours"]:
    nights = parse_nights(t["duration"])
    flag = "  <-- can't read" if nights is None else ""
    print(f'{t["name"]:<22} {str(t["duration"]):<22} nights={nights}  months={t["availableMonths"]}{flag}')

print(f'\n{data["count"]} published tours')