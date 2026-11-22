---
name: skill-news
description: Show new Claude Code skills from GitHub in a native popup and install the ones the user picks. Use when the user says "skill news", "any new skills", "what skills are new", or runs /skill-news. Also use inside a weekly scheduled task.
---

# skill-news

Find skills added to GitHub in the last 7 days and let the user choose which to install.

## Steps

1. Fetch the feed: `curl -s https://raw.githubusercontent.com/flisk-sh/skill-news/main/feed.xml`. Each `<item>` is a commit on a skills repo (title, owner/repo, link, pubDate). Keep items from the last 7 days.
2. From those commits, find NEW skill folders: a directory containing `SKILL.md` that was added. Use `gh api repos/<owner>/<repo>/commits/<sha>` on the commit link. Skip any name already in `~/.claude/skills/`.
3. If nothing is new, say so in one line and stop.
4. Call `AskUserQuestion` with `multiSelect: true`. Header "New skills". One option per skill: label = an emoji and the skill name, description = one line on what it does and the source repo. Max 4 options per question, so ask in several questions if there are more. Always add a last option "Skip all this week".
5. If the user picked "Skip all this week" together with skills, ask once which they meant. Never install on a contradictory answer.
6. Try to install each chosen skill: shallow clone into a temp dir, `cp -R` the folder into `~/.claude/skills/<name>/`, delete the temp dir. Never overwrite an existing folder without asking.
7. If the permission system denies the install (it does in scheduled runs), do not retry or work around it. Print one ready-to-paste command per chosen skill, each in its own `bash` block, for the user to run in a terminal:
   `T=$(mktemp -d) && git clone -q --depth 1 https://github.com/<owner>/<repo>.git $T/r && cp -R $T/r/<path-to-skill-folder> ~/.claude/skills/ && ls ~/.claude/skills/<name>`
8. Report what was installed or printed. New skills load without a restart.

## Weekly

To run this every Monday, create a scheduled task whose prompt is "Run the skill-news skill."
