# FIRST LEGO League TMS Release Notes

## V2019.1.3 - 18-Jan-2020

1. Scoring
    1. Fix: Fixed issue where when pressing Edit on a score in the ranking round 1, the round selection button for round 2 was selected, so that when Done was pressed, the score was saved for round  2.


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