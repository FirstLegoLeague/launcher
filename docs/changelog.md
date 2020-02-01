# FIRST LEGO League TMS Release Notes

## V2019.1.3 - 1-Feb-2020

### Issues fixed - Simply Speaking

This is not a mandatory update. If you are happy with the way the scoring system has worked for you so far this season, then don't update. If some of the issues fixed are getting in your way. please download and install.

- In Tournament Setup, fix Current Match
- In the Scoresheet, fix issues due to intermittent WiFi coverage
- In the Scoresheet, fix issue with team number selection after editing the scoresheet of another team.

### Issues fixed - Technically speaking

1. Scoring
    1. Fix: Intermittent WiFi coverage sometimes caused scores entered on a tablet or WiFi connected PC to be submitted more than once.
    1. Fix: Fixed issue where when pressing Edit on a score in the ranking round 1, the round selection button for round 2 was selected, so that when Done was pressed, the score was saved for round 2.
    1. Fix: When logging in as referee it was possible to see all the scoring tiles.
    1. Fix: Scoresheet iPad formatting issues. The scoresheet was not designed for the iPad form factor. Fixed by having a drop-down for the rounds, instead of buttons.
    1. Fix: If a full Schedule file with match information has been loaded, the scoresheet automatically loads the team of the upcoming match. This feature has been disabled for the Admin and Scorekeeper roles, as the head ref/scorekeeper's work is usually not aligned with the schedule. The feature now works for referees only.
    1. Enhancement: Scoresheet has a local settings screen. Settings currently supported:
        - Disable scoresheet automatic scroll
        - Change scoresheet language. This is useful when a team's home language is different from the one used by the tournament.

1. Tournament Setup
    1. Fix: Dropping a non-csv file on the schedule import failed. Now only .CSV files cam be dropped onto the Import box.
    1. Fix: The input that allows manual changes to the Current Round was broken, and now works.
    1. Fix: If a full Schedule file with match information has been loaded, swithing between Practice and Ranking Stages, sets the Current Match to the 1st match of the new Stage.
    1. Enhancement: Support UTF-8 CSV schedule files and team lists. Team names in Chinese, Arabic, Hebrew, etc now correctly imported and displayed.

1. Scoreboard
    1. Fix: Scaling issues with local sponsor logos have been fixed.
    1. Fix: Remove margin when hiding the local sponsor logos.
    1. Enhancement: Additional font sizes and scrolling speeds.
    1. Fix: Vertical scrolling issues, after selecting/deselecting logo strip
    1. Enhancement: Group no-score teams followed by no-show teams so that no-show teams are at the end of the list.

## V2019.1.2 - 14-Nov-2019

### Issues fixed - Simply Speaking

- There is one very important bug fix - see first item in `Scoring` below.
- Most of the other changes in this version are minor bug fixes or enhancements.

### Issues fixed - Technically speaking

1. Scoring
    1. Fix: Corrected bug where edited a team score and then saving the result (regardless whether anything was changed), the result could be saved to a different team and causing a score conflict.
    1. Fix: Corrected spurious communications loss warning.
    1. Enhancement: In Scores tiles view, add Sort by date.
    1. Fix: In Scoresheet, fixed Next Round advance after submitting scoresheet.
1. Tournament Setup
    1. Fix: Corrected bug where, when doing a Schedule/Team List Import a 2nd time, the import screen showed the data from the 1st import.
1. Timer
    1. Fix: Prevent double timer start by starting timer during delayed start was pressed i.e. pressing `delayed start` followed immediately by `start`.
1. Scoreboard
    1. Enhancement: Local sponsor logos only scroll when there are more logos than can fit into the screen. Scrolling (when it does happen) is smoother.
    1. Enhancement: Automatically hide/unhide local logos strip if there are no local logos/when 1st logo is added.
    1. Enhancement: Improved team scores scrolling speed setting, and added two more font sizes.
    1. Fix: Corrected bug in team scores scrolling after hiding/showing local sponsor logo strip.
1. Status
    1. Enhancement: Size of circle in Status Display increased.