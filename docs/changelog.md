# FIRST LEGO League TMS Release Notes

## V2018.1.2 - 13-Nov-2018

### Issues fixed

In **TMS Version v2018.1.1** there is an issue where the Timer resets approximately every 10 matches. In this update the Timer restarts from where it left off. Teams will notice the Timer freeze for approximately 5 seconds after which the countdown will resume at the correct countdown value.

[Further details](http://www.fll-tools.com/general/workaround-for-timer-reset/)

## V2018.1.1 - 8-Nov-2018

### Issues fixed - Simply Speaking

- **System freeze problem encountered at some events, and which required Launcher restart**, now fixed at two levels:
  - The reason for the specific problem was identified and fixed.
  - In addition, a safety measure was added that causes critical system components (such as timer) to automatically restart if a similar problem should happen as result of a different issue.
  - **This version is significantly more stable than v2018.1.0**
- Support for **32-bit computers** added (Note: 32-bit is in Beta)
- Problem where **Scoreboard stopped updating** (user had to refresh the browser) now fixed.
- Problems that were caused by **importing non-valid schedule files** are prevented by improved data validation during file import (reason given for abort of import)
- Problem where you **couldn’t submit a score (because you couldn’t select the round), caused by network connectivity issues**, is now fixed. Round selection can be skipped, score can be submitted, and user can start scoring next team. When connectivity is restored, all accumulated scores are sent automatically to the server. See the [user-guide](https://github.com/FirstLegoLeague/Launcher/blob/user-guide/docs/userguide.md#bad-scores) for further details.
- Problem where the score entry screen did **not correctly mark rounds that are already scored for the team**, is now fixed.
- Scoreboard no longer shows **empty parentheses when affiliation is not used**
- **Saving the logs for support** is now easier to perform, and captures more data.
- Some other ‘cosmetic’ fixes.

##3 Issues fixed - Technically Speaking

1. Change internal communications mhub log level to INFO
1. Restart module servers after crash.
1. Fix support for Windows 32-bit
1. Fix bug in rankings module - After module crash and self-restart, scores not updated on Scoreboard.
1. Launcher: after pressing link to Support, there is no way to go back again. Support website now opens in browser.
1. Launcher About screen - replace Save debug data link with button.
1. Launcher: When saving logs, save scoring and configuration database too.
1. Tournament Setup: Don’t permit import team if it doesn’t have a team number.
1. Tournament Setup: Fix import of schedule file containing table names with embedded blanks.
1. Scoring: Entering score without referee name from role admin shows "undefined" in scoring tile.
1. Scoring: During connectivity interruption, Select Round list is blocked, and score cannot be submitted.
1. Scoring: Connectivity status not updated when connectivity restored.
1. Scoring: Sometimes completed rounds not shown with tick (Not all scenarios of this bug have been fixed).
1. Scoreboard: Don't show empty affiliation next to team name.
