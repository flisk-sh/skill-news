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
6. For each chosen skill, copy its folder from the repo into `~/.claude/skills/<name>/` (shallow clone into a temp dir, then `cp -R`). Never overwrite an existing folder without asking. Delete the temp dir.
7. Report what was installed. New skills load without a restart.

## Weekly

To run this every Monday, create a scheduled task whose prompt is "Run the skill-news skill."
