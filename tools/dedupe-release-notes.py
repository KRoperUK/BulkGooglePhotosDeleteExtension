#!/usr/bin/env python3
"""Collapse duplicate release-note entries into one line per commit message.

Merge commits and their inner commits carry the same message, so Release Please
lists both. This rewrites

    * fix: thing ([abc1234](url1))
    * fix: thing ([def5678](url2))

as

    * fix: thing ([abc1234](url1), [def5678](url2))

Usage:
    python3 tools/dedupe-release-notes.py notes.md > notes-deduped.md
    gh release view v1.2.3 --json body --jq .body | python3 tools/dedupe-release-notes.py
"""

import re
import sys

ITEM = re.compile(
    r"^\* (?P<title>.+?) \(\[(?P<sha>[0-9a-f]{7,40})\]\((?P<url>[^)]+)\)\)\s*$"
)


def process(text):
    lines = text.splitlines()

    links_by_title = {}
    for line in lines:
        match = ITEM.match(line)
        if match:
            link = f"[{match.group('sha')}]({match.group('url')})"
            links_by_title.setdefault(match.group("title"), []).append(link)

    out = []
    emitted = set()

    for line in lines:
        match = ITEM.match(line)
        if not match:
            out.append(line)
            continue

        title = match.group("title")
        if title in emitted:
            continue
        emitted.add(title)

        links = list(dict.fromkeys(links_by_title[title]))
        out.append(f"* {title} ({', '.join(links)})")

    return "\n".join(out) + "\n"


def main():
    if len(sys.argv) > 1:
        with open(sys.argv[1], encoding="utf-8") as handle:
            text = handle.read()
    else:
        text = sys.stdin.read()

    sys.stdout.write(process(text))


if __name__ == "__main__":
    main()
