#!/usr/bin/env python3
"""Pull public LeetCode stats for the site's Now view into data/leetcode.json.

Run by .github/workflows/leetcode.yml once a day. Leaves the file alone if the
request fails, so the site keeps showing the last good numbers.
"""
import datetime
import json
import pathlib
import sys
import urllib.request

USER = "Yashscodes"
OUT = pathlib.Path(__file__).resolve().parent.parent / "data" / "leetcode.json"
QUERY = """query($u: String!) {
  matchedUser(username: $u) {
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    userCalendar { streak totalActiveDays }
  }
}"""


def main():
    req = urllib.request.Request(
        "https://leetcode.com/graphql",
        data=json.dumps({"query": QUERY, "variables": {"u": USER}}).encode(),
        headers={"Content-Type": "application/json", "Referer": f"https://leetcode.com/u/{USER}/", "User-Agent": "24yash.github.io stats"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            user = json.load(resp)["data"]["matchedUser"]
    except Exception as exc:  # network, rate limit, schema change
        print(f"LeetCode fetch failed, keeping old data: {exc}")
        return 0
    counts = {row["difficulty"].lower(): row["count"] for row in user["submitStatsGlobal"]["acSubmissionNum"]}
    cal = user.get("userCalendar") or {}
    data = {
        "all": counts["all"],
        "easy": counts["easy"],
        "medium": counts["medium"],
        "hard": counts["hard"],
        "streak": cal.get("streak", 0),
        "activeDays": cal.get("totalActiveDays", 0),
    }
    old = json.loads(OUT.read_text()) if OUT.exists() else {}
    if {k: old.get(k) for k in data} == data:
        print("No change")
        return 0
    data["updated"] = datetime.date.today().strftime("%-d %b %Y")
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2) + "\n")
    print("Updated", data)
    return 0


if __name__ == "__main__":
    sys.exit(main())
