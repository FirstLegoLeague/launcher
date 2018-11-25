# FIRST LEGO League TMS Release Notes

## V2018.1.3 - 27-Nov-2018

### Issues fixed - Simply Speaking
- Issue that prevented TMS app startup on some computers solved.
- Added support for the French Canadian scoresheet.
- Improved Scoreboard apearance.
- Improved Scoresheet apearance on some devices.
- Improved Tournamnet setup, preventing some common usage mistakes.

### Issues fixed - Technically speaking

1. Fixed bug that prevented TMS app startup when the computer had no network connections.
1. Improve aperance of timer on Scoreboard.
1. Show the stage (Practice or Ranking) on the Scoreboard. This helps audience and tournament organizers understand what should be displayed.
1. In Tournament Setup, when adding matches manually, implemented a dropdown for the stage names restricting them to `Practice` and `Ranking`.
1. Added support for the French Canadian scoresheet.
1. When editing a Scoresheet, added a Cancel button. This allows the Scorekeeper to close a scoresheet they are editing without making changes.
1. On the Scoresheet, ensure that buttons appear on the right. Previously, they would sometimes shift to the left when the mission text was long. For example, missions M04 or M08.
1. For clarity and consistency, added the word `Save` to the save buttons in the Settings screen of Tournament Setup.
1. Now ignoring files dropped by mistake onto the launcher window. Previously dropping such a file would block using the launcher without restarting the TMS app.
1. On Scoreboard, added a left margin to the _FIRST_ LEGO League logo.

## V2018.1.2 - 13-Nov-2018

### Issues fixed

In **TMS Version v2018.1.1** there was an issue where the Timer resets approximately every 10 matches. In this update the Timer restarts from where it left off. In case of a similar error, Teams will notice the Timer freeze for only 5 seconds after which the countdown will resume at the correct countdown value.

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

### Issues fixed - Technically Speaking

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
