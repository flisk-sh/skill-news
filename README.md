# skill-news

A weekly newspaper of new Claude Code skills. Once a week Claude Code opens a popup in the middle of your window, shows the skills that appeared on GitHub, and installs the ones you tick.

[![feed](https://img.shields.io/badge/RSS-feed.xml-orange)](https://raw.githubusercontent.com/flisk-sh/skill-news/main/feed.xml)

## Why

New skills land every week in repos like `anthropics/skills` and `mattpocock/skills`, and nobody reads commit logs. skill-news turns them into one RSS feed and one question: "install any of these?"

## Set it up in a minute

1. Paste this to Claude Code:

   > Every Monday at 9, read https://raw.githubusercontent.com/flisk-sh/skill-news/main/feed.xml, find skills added in the last 7 days, ask me with the AskUserQuestion popup (multi-select) which to install, and copy the chosen ones into ~/.claude/skills/.

2. Or subscribe to the feed in any RSS reader: `https://raw.githubusercontent.com/flisk-sh/skill-news/main/feed.xml`

## Or install it as a skill

```bash
git clone --depth 1 https://github.com/flisk-sh/skill-news /tmp/skill-news && cp -R /tmp/skill-news/skills/skill-news ~/.claude/skills/
```

Then type `/skill-news` in Claude Code any time.

## Installing the picks

Claude Code's permission system can block a scheduled task from writing into `~/.claude/skills/`. When that happens, skill-news prints one install command per skill you ticked. Paste it into a terminal and the skill loads without a restart.

## How it works

A daily GitHub Action reads the Atom feeds in `sources.json` and writes `feed.xml`. No server, no keys, no database.

## Add a source

Append a `https://github.com/<owner>/<repo>/commits/main.atom` URL to `sources.json` and open a PR.

MIT.
