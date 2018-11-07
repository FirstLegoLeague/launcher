# *FIRST* LEGO League TMS User Guide

Last Updated: 7-Nov-2018

This guide is intended to help *FIRST* LEGO League tournament orgnizers use the Tournament Management System (TMS).

Click [here](https://github.com/FirstLegoLeague/Launcher/blob/user-guide/docs/userguide.md) for the latest version of this document.

You can also watch a [recording of the Webinar](https://register.gotowebinar.com/register/8980264911390903809) that was held on Sep 24th, 2018 (the actual recording starts at 1’30”). After registering you will have immediate access to the Webinar.

## Table of Contents

- [Overview](#overview)
	- [Hardware required](#hardware-required)
	- [Computer requirements](#computer-requirements)
	- [Installation](#installation)
	- [Modules](#modules)
- [Quick Start](#quick-start)
- [Launcher](#launcher)
	- [Home](#home)
	- [Settings](#settings)
- [Login](#login)
- [Tournament Setup](#tournament-setup)
	- [Tournament Settings](#tournament-settings)
	- [Images](#images)
	- [Import team data](#import-team-data)
	- [Teams](#teams)
	- [Matches](#matches)
- [Scoring](#scoring)
	- [Scoresheet](#scoresheet)
	- [Score management screen](#score-management-screen)
	- [Scoring tiles](#scoring-tiles)
		- [Scoring tile](#scoring-tile)
		- [Duplicate scores](#duplicate-scores)
		- [Bad scores](#bad-scores)
- [Scoreboard](#scoreboard)
- [Timer](#timer)
- [Tournament Status Display](#tournament-status-display)
- [Networked Computers](#networked-computers)
	- [Use of iPads and tablets](#use-of-ipads-and-tablets)
- [Network adapters](#network-adapters)
- [Log files](#log-files)
- [Bug reports and feedback](#bug-reports-and-feedback)
- [Changelog](#changelog)
- [Known Issues](#known-issues)

## Overview

The Tournament Management System is an application that enables *FIRST* LEGO League tournament organizers to record robot game mission results on an digital scoresheet and to display the match results on a scoreboard.

The system is made up of a number of components which we call modules. Each module implements a specific function. All modules, except the launcher, are displayed through your computer's default browser.  

Note: Currently we only support the Chrome browser.

This software is the result of volunteer efforts by groups in The Netherlands, Israel and the USA.

### Hardware required

The software can be run entirely on a single laptop (for small, low resource, competitions) through to larger installations with multiple scorekeeper computers, a separate scoreboard display computer and head referee/field manager computer. If a wireless router is available, referees can do score input using iPads or tablets. See [Networked Computers](#networked-computers).

The [Example hardware configurations](https://github.com/FirstLegoLeague/Launcher/blob/user-guide/docs/example-hw-configs.md#example-hardware-configurations) guide shows how you might equip your tournament, and how the various computers are used and connected to each other,

### Computer requirements

The computer on which the software is installed should be a Windows Intel I5 with 8GB of memory, or better. Approximately 1.5 GB of disk space is required. The other computers (scorekeepers, timer, scoreboard display) only need to run a browser and therefore have mimimal hardware needs.

Note: Currently we only support 64-bit computers. We are working to extend support to older 32-bit computers.

### Installation

Download (from fll-tools.com/software, scroll down to Bundled Installer) and run the setup file. The default installation drive is C: but you can choose a different drive if required.

To upgrade this software with a new version, run the setup file without first uninstalling the previous version. The existing tournament configuration (schedule or team list) and team scores will be preserved. All TMS browser tabs MUST be refreshed by pressing CTRL-F5 (refresh with cache clear).

When running the software for the 1st time, you might get a message regarding the Windows Defender Firewall. Press `Allow Access` for the software to work properly.
Note: Some school computers and networks block various types of network traffic. This software requires that computer and network firewalls allow access to ports 2828 though 2837, and also port 13900.

There will be two separate Setup files when we extend support to 32-bit computers.

### Modules

1. [**Launcher:**](#launcher) provides a panel through which the user opens the other modules. Module configuration is done from the launcher.
1. [**Tournament Setup:**](#tournament-setup) loads tournament schedule file or team list and provides tournament-wide configuration options.
1. [**Scoring:**](#scoring) provides score entry and management. The referee or scorekeeper selects a team (loaded in `Tournament Setup`) and round, and records missions completed by the team's robot. After the score has been submitted it can be viewed in a searchable list of all the scores.
1. [**Scoreboard:**](#scoreboard) shows the team's match results.
1. [**Timer:**](#timer) starts and displays the match timer.
1. [**Tournament Status Display:**](#tournament-status-display) (not completed yet) shows whether the tournament is running ahead or behind schedule, and also shows the "next up" teams.

## Quick Start

If you don't have time to read this whole guide or you need just to know the steps to get going, this paragraph is for you.

1. Start the `Launcher`
1. Open the Tournament Setup page (role: admin, password:admin-pass)
    1. Set your Tournament name (Tournament Settings / Tournament Title / Save)
    1. Add your sponsor logos (Images / Add Image)
    1. Load the schedule file or team list (Import / Import Schedule file)
1. Open the Scoreboard page
1. Open the Timer page
1. Open the Scoresheet (click `Scoring`)
    1. Enter the referee name (optional for admin or scorekeeper roles)
    1. Choose the table  (optional for admin or scorekeeper roles)
    1. Select the team from the dropdown list
    1. Select the round from the list that appears to the right of the team list.
    1. Score each mission, and let the technician sign the scoresheet
    1. Press Submit
1. On the left of the `Scoring` tab, click the menu icon (3 horizontal lines that look like a hamburger)
    1. The list of scores entered so far are shown
1. The Scoreboard page shows the scores entered **for the current stage**.

## Launcher

The `launcher` is used to open and configure the TMS modules.

<img src="./images/launcher.png" style="width:75%"> 

### Home

The `Home` screen provides clickable links to open the modules, each in it's own browser tab.
For example, click the `Timer` or it's ip address to open the `Timer`. 

You can also press the `Copy link` button to copy the module address, and then paste it into the browser address bar. Do this when your default browser is not Chrome.

If you are using an iPad, the QR-Code can be used. The Chrome browser on the iPad has a built-in QR-Code reader.

### Settings

Module configuration is accessed through the `Settings` screen.

<img src="./images/settings.png" style="width:75%">  

**Timer**  
Timer settings - display countdown in minutes:seconds from 2:30 or in seconds from 150.

**Passwords**

Set `Passwords` for the four predefined `roles`. See [Login](#login) for a description of the roles.  
Press `Save` to make the change permanent.

**Scoreboard**  
Configure whether negative scores are shown as 0 on the `Scoreboard`. Default is YES.

Note: The Scoring screen (intended for the Head Referee) will still show negative scores.

Note: The Referee Standards require that negative scores be shown as zero. This option will be removed in the future.

**Scoring**

Configure the [Scoring](#scoring) module settings.

- Select the scoresheet `Challenge` and language.
- `Require a referee name` selects whether a referee name is required on a scoresheet.
    - Applies to all roles.
    - Default: YES
- `Auto-publish team scores` - When configured to YES, scores will be sent to the `Scoreboard` immediately when the referee or scorekeeper presses the `Submit` button. If configured to NO the scores must be [manually published](#scoring-tile), usually by the scorekeeper.
    - Applies to all roles
    - Default: YES.
- `Require a Table` selects whether a table name is required on a scoresheet.
    - Applies to all roles
    - Default: YES
- `Require a team signature` selects whether the scoresheet must be signed before it can be submitted. Usually when the scoresheet is completed by the referee, the team technician will be required to sign the scoresheet. A signature is usually not required when a scorekeeper enters the mission information.
    - Applies to all roles
    - Default: YES.
- `Display mission score if zero` selects whether `0` is shown on the scoresheet when the team robot has not succeeded in completing a mission.
    - Applies to all roles
    - Default: NO  

Press `Save` to make the change permanent.

Note: **After making a change to ANY of the above settings you need to refresh the browser `Scoring` tab (by going to the tab and pressing F5)**.

**Advanced**

Configure the software logging level and Network Adaptor.

**About**

Information about this software, including how to contact the developers.

**Help**

Show this document

## Login

Access to the module screens are password protected. Each of the 4 predefined roles (admin, scorekeeper, referee and mc) has it's own password.

- `admin` - tournament administrator or head referee. 
    - Has access to all screens. 
    - Default password: admin-pass
- `scorekeeper` - transfers missions completed from paper scoresheets into the digital scoresheets. Can also view all scores entered so far.
    - Has access to scoresheet, scores and Timer screens.
    - Can export rankings but cannot delete all scores.
    - Can use the `Set default values` and `Reset scoresheet` buttons.
    - Default password: sk-pass
- `referee` - Records the state of the robot game on a digital scoresheet. Usually used on iPads or tablets.
    - Only has access to the scoresheet.
    - Does not have the `Set default values` or `Reset scoresheet` buttons.
    - Default password: ref-pass
- `mc` - Accesses the Timer screen. Can start and stop matches.
    - Default password: mc-pass

We strongly recommend that you change the default passwords.

<img src="./images/login.png" style="width:75%">

Since the password is encrypted before saving, a saved password cannot be recovered. You can press the "eye" icon to see the password as you type it, but once you leave the passwords screen, you cannot view it again.

When you login with a role (username) and password, that role is valid for all tabs opened in the browser. If you open an Incognito tab or a different browser, you can login again using a different role.

You must allow cookies to be saved, as the TMS uses them to save encrypted passwords (to avoid having to login to each module individually). Login will fail is cookies are blocked. Note: Cookies are not used by TMS for any other purpose.

## Tournament Setup

The `Tournament Setup` screen is the place where the tournament organizer or head referee sets up the tournament.

### Tournament Settings

The `Tournament Settings` screen is where you configure general settings for the tournament.

<img src="./images/tournament-settings.png" style="width:75%">

- Use the `Stage` dropdown to set the current stage of the tournament. Most tournaments have `practice` and `ranking` stages. When you import a `Schedule File` the stage names in the file are used. Default stage names are used if you import a `Team List`. Press the `Save` button after changing the stage. If scores have already been entered for the new `Stage` they will appear on the `Scoreboard`.
- `Delete Tournament Data` - Use the `Delete` button to delete the Teams and Matches.  You will be asked to confirm. **Note this is permanent and deleted scores cannot be recovered**. The system will verify that there are no team scores before deleting teams or matches, which means that you will have to delete scores before deleting teams (and matches). You delete scores in the `Scoring` module.
- The `Tournament Title` shown on the `Scoreboard` is configured here.

### Images

The sponsor logos shown on the [Scoreboard](#Scoreboard) ribbon are configured here.

<img src="./images/tournament-images.png" style="width:75%">

The four *FIRST* LEGO League global sponsors are preloaded. You can add additional images files by pressing the `Add Image` button. Press the `Delete` button on an image tile to remove it.

Note: A later version of this software will support hiding logos that you do not want to be displayed but that you wish to keep.

### Import team data

The next step is to import a schedule file or team list. Click `Import` on the right of the screen and select to import a `Schedule File` or `Team List`

Note: `Import` is only available when the team list is empty.

<img src="./images/tournament-import.png" style="width:75%">

- `Schedule file` - Import a CSV schedule file that follows the format of the Tournament Scheduler Excel spreadsheet. This file contains team numbers and names as well as the tournament matches time schedule.
  * [Format specification](https://github.com/FirstLegoLeague/Launcher/blob/user-guide/docs/Scoring_Schedule_Input_File_Format.doc)
  * [Example 24 Team Full Schedule](./files/24_Team_Full_Schedule.csv). Click to [Download](./files/24_Team_Full_Schedule.csv.zip) and then unzip.
- `Schedule file - shortened` - Import a CSV schedule file exported from one of the Excel-based `Team Tournament Schedule Templates` in the [_FIRST_ LEGO League Tournament Manual](https://firstlegoleague-eventmanuals.pbworks.com/w/page/85093483/Chapter%209%20Home%20Page). The templates can be downloaded from the Wiki. These CSV Export files do not contain match information, or table names. You will need to add table names afterward the import.
  * [Example 12 Team Tournament Schedule Template 3.1](./files/12_Team_Tournament_Schedule_Template_3.1.csv). Click to [Download](./files/12_Team_Tournament_Schedule_Template_3.1.csv.zip) and then unzip.
  * [Example 52 Team Tournament Schedule Template 3.1](./files/52_Team_Tournament_Schedule_Template_3.1.csv). Click to [Download](./files/52_Team_Tournament_Schedule_Template_3.1.csv.zip) and then unzip.
- `Team List` file - Import a plain CSV team list. The file must have the team number, team name and general information, such as team affiliation, in the first 3 columns. This file does not contain match information, or table names. You will need to add table names afterward the import.
  * [Example 24 Team List](./files/24_Team_List.csv). Click to [Download](./files/24_Team_List.csv.zip) and then unzip.
  
Note: We do not currently (In the beta versions, and in version 2018.1.0) make use of the match information. See [Tournament Status Display](#tournament-status-display).

Drag and drop a schedule file or team list onto the popup.

<img src="./images/tournament-import-schedule.png" style="width:75%">

Verify that the data looks correct and then press `Import`.

Once you have imported the file you can see all the imported data by pressing the `Teams` and `Matches` buttons. 

If you need to replace the imported data with a different CSV file, you can delete all the teams and matches, and import again. See [Tournament Settings](#tournament-settings) - `Delete Tournament Data`.

### Teams

On the `Teams` screen you can edit the team name and affiliation, or delete a team. You cannot change the team number. There is also a `Add Team` button. Be sure not to use a team number that is already taken. Note that a newly added team does not immeditaly appear - you must refresh the browser or switch to a differet screen (such as 'Matches') and then back again to see a newly added team.

You can search for a team by number. Enter # and the team number in the search box. You can also search by team name

### Matches

The `Matches` screen shows all the match information.

<img src="./images/tournament-matches.png" style="width:75%">

You can edit match information or delete a match. You can also [add a match](#+-match) or add, delete or rename the tables. Be careful not to enter conflicting data.

You can search for matches of a team by entering the number in the search box.

#### Manage Tables

Press the ```Manage Tables``` button to add or edit table names. If you imported a schedule file, the table names will be those in the file. If you imported a shortened schedule file or team list, you can add the table names here.

Note: The table names are optional but are required if you want the scorekeeper or referee to assign a table to each scoresheet.

#### + Match

Press the ```+ Match``` button to add matches. This can be done if you have imported a team list or schedule file without match information. See [Tournament Status Display](#tournament-status-display) for information on how the matches data is used.

## Scoring

The `Scoring` module is used by the `Referee` or `Scorekeeper` to complete a scoresheet and by the `Head Referee` or `Scorekeeper` to manage the scores already entered into the system.

### Communication status

The top line of the Scoring screen shows the communication status.

1. `Online` - Scoring results are being submitted sucessfully.
1. `Comms Interruption` - Scoresheet results cannot be sent due to a communication issue. Check connectivity between the scoresheet computer or tablet, and the TMS server. Scoresheet results are saved in the browser and will be sent when communication is restored.
1. `Offline` - Communications have been interrupted for 5 minutes or more. Check connectivity between the scoresheet computer or tablet, and the TMS server. Scoresheet results are saved in the browser and will be sent when communication is restored.

### Scoresheet

The scoresheet text follows the official scoresheet exactly.

<img src="./images/scoring.png" style="width:75%">

- `Select Team` - Choose the team to score. After selecting a team, you select the `Round`.
- `Select Round` - Select the `Round` to score. Rounds for which a score have already been entered are indicated by a tick mark.
- `Points` shows the accumulated points of missions scored so far.
- `Default` sets all the unscored missions to their default (usually unscored) value. This shortcut may be used when a team has successfully done only a few missions - score those missions and then press `Default` to rapidly complete the other missions. This option is not available when the referee role is logged in since the referee is required to go over all the missions with the team technicians.
- `Reset` - reset the scoresheet to it's unscored state.
- `?` - Show the mission description.

As you click each mission condition, the system checks for consistency. For instance, in the 2018 challenge `INTO ORBIT - M05 Extraction` mission, the `Gas Core Sample` cannot be both in the `Lander's Target Circle` and in `Base`.

<img src="./images/scoring-mission.png" style="width:75%">

Once all the scoring requirements of a mission have been marked, the mission score value is shown, and the accumulated points are updated. The page automatically scrolls to the next mission.

If you get to the end of the scoresheet without having scored all the missions, you will see a red `Some missions are incomplete` notification.

<img src="./images/scoring-mission-incomplete.png" style="width:75%">

Click the notification to jump to the first incomplete mission. You will also be notified if the `Team` or `Round` has not been selected.

The team signs the scoresheet in the space provided, and then press `Submit`. You will see a `Score saved successfully` message.  
Note: [Require a Signature](#settings) is configurable in the Settings.

### Score management screen

Press the menu icon on the top left of the `Scoresheet` to open the `Score management` screen.  

<img src="./images/scoring-management.png" style="width:75%">

- **Search scores** - enter text to filter which scores are shown. Examples:  
  - `practice` - show all practice scores
  - `ranking #2` - show all scores in round `ranking 2`
  - `#62` - show all scores of team 62
  - `#7` - show all scores of teams with team numbers that start with 7. Add a space after the number 7 to show only scores for team 7
  - `Table 3` - show all scores on `Table 3`
- **Delete all scores** deletes all scores on the system. You will be asked to confirm. **Note this is permanent and deleted scores cannot be recovered**.
- [**Download rankings**](#tournament-settings) downloads the  scores to a CSV file that can be used by Judging-Lite. Note: When the `Stage` in `Tournament Settings` is set to `practice`, those scores are exported. When it is set to `ranking`, ranking scores are exported.

### Scoring tiles

All the information relating to a particular score is shown in a scoring tile. 

#### Scoring tile  

<img src="./images/scoring-tile.png" style="width:75%">

- `Team number and name` - change the team to which this score is assigned
- `Round` - change the `round` to which this score is assigned
- `Score` - change the `score` for this match. Note: if you do this, the score will no longer be the same as the accumulated score on the scoresheet.
- `referee` and `table` - change the `referee` and `table`.
- `Edit scoresheet` - open the scoresheet for editing. `Scorekeepers` may use this to verify the scores entered by the `referee`.
- `Publish / Unpublish` - publishing (`+`) a score causes it to appear in the `Scoreboard`. Unpublishing (`-`) causes the score not to appear in the `Scoreboard`. Note: The `-` symbol that means the score is published, `+` means it is unpublished.
- `Delete` - delete a score. You will be asked to confirm. **Note this is permanent and a deleted score cannot be recovered**.

#### Duplicate scores

<img src="./images/scoring-duplicate.png" style="width:75%">

The `Show only duplicates` button is enabled when more than one score has been submitted for the same team and round. Clicking the button filters out all scores that are not duplicates. This gives the head referee or scorekeeper a way to easily check for duplicate scores, and to correct the error.

#### Bad scores

The `Show only bad scores` button is enabled when scores cannot be sent to the `Scoreboard`. This might happen when entering match results on a iPad and the WiFi connection is interrupted. See [Communication status](#communication-status).

Due to the interruption, the list of Rounds cannot be retrieved from the `Launcher` and the referee can choose to submit the score without the `Round`, thereby freeing up the iPad for the next match. On the head referee or scorekeeper [Scoring tile](#scoring-tile) this match's round will be shown as `Missing`, and the `Show only bad scores` button will be enabled. This will alert the head referee or scorekeeper to the fact that they need to fix the missing `Round`.

## Scoreboard

The `Scoreboard` shows the team scores for the current stage and continuously scrolls through all the teams.

<img src="./images/scoreboard.png" style="width:75%">

The left-most column shows the team's rank. The rank is taken from the `High` score. Ties are broken using 2nd, then 3rd best scores. Teams without scores don't have a rank and are ordered by team number.

The 2nd column shows the team's name. When available, the team affiliation information is shown in brackets (see [Import team data](#import-team-data)).

When there are scores for a single round only, they are shown in a `Score` column. For example, during the Practice round and also during the 1st Ranking round, only one column is shown.

When there are scores for multiple rounds, there will be a `High` column containing the team's best score, followed by a column for each round.

The tournament title is configured in the [Tournament Settings](#tournament-settings) screen.

The sponsor logos ribbon is configured in the [Tournament Images](#images) screen.

## Timer

The `Timer` (clock) is used to start matches and provides a 2:30 minute countdown timer.

<img src="./images/timer.png" style="width:75%">

There are 3 action buttons

- Start the timer
- Reload the timer - resets the timer to 2:30 minutes
- Stop the timer - does an automatic reload

The musical note in the top left hand corner of the screen is used to test the four sounds.

<img src="./images/test-sounds.png" style="width:75%">

During a match the elapsed time is overlaid onto the Scoreboard.

<img src="./images/scoreboard-with-timer.png" style="width:75%">

The timer can be activated on any computer or tablet on the network. The sound files are played only on the computer where the TMS is installed and this computer must be connected to to a loudspeaker system if required.

## Tournament Status Display

This display shows whether the tournament is running ahead of schedule or behind schedule. It also shows the teams that will play in the upcoming matches.

Note: This display can only function if a [schedule file is imported](#tournament-setup).

Note: Not implemented in the beta versions or version 2018.1.0 (release date 17-Oct-2018)

## Networked Computers

At a larger tournament you might have a number of computers connected to each other using a router. We recommend that the connections to the router be wired connections rather than WiFi, especially in school environments where there might be other WiFi networks.

### Use of iPads and tablets

We have done limited testing of referee score input using iPads and WiFi. No problems were encountered. If  there is a temporary loss of connectivity when the scoresheet is submitted, the results are saved locally in the iPad, and are sent again together with the submit of the subsequent scoresheet.  
**Note:** Additional functionality has been added since these tests. Tournament organizers that intend using iPads should coordinate this with the development team. See the About screen for contact details.

## Network adapters

Many laptop PCs have more than one `Network adapter`. For instance, there might be a wired RJ45 adapter and a WiFi adapter. If you have multiple computers in a network you must ensure the TMS is configured to use the correct adapter. This is done in the `Launcher Settings Network Connections` screen.

<img src="./images/launcher-network-connections.png" style="width:75%">

## Log files

The software records activities in logfiles. When reporting a bug please attach these logs. The logs may be collected into a .ZIP file by pressing the `Save debug data`/`Save logs` button at the bottom of the app `About` screen.

Logging should be set to DEBUG.

<img src="./images/launcher-loglevel.png" style="width:75%">

Note: When reporting a bug please include the software version which can be seen in the Home screen of the [Launcher](#launcher).

## Bug reports and feedback

Bug reports should be emailed to FLL-TMS-Support@firstinspires.org

Please provide the following information:

1. Software version. Can be found in the Home screen of the [Launcher](#launcher)
1. A description of what went wrong.
1. A description of your hardware configuration
    - how many computers you are using and what you are running on each of them (e.g. [timer](#timer), [scoring](scoring), [scoreboard](#scoreboard))
    - whether you are using a router for your network, or whether you are using the tournament venue's wired or WiFi network
    - whether you use iPads for score entry
1. Attach log files and debug data. These can be collected from the app About screen, by pressing the `Save debug data/Save logs` button.
1. How you entered team information in [Tournament Setup](#tournament-setup).
    - A schedule file or a team list was imported
    - OR Teams were added one by one manually
    - If you imported a file, please send that too.

Please send comments/suggestions/questions about this document to Alan Green at agreen@firstinspires.org

## Changelog

[List of updates and bug fixes](./changelog.md)

## Known Issues

1. After making changes to the scoring settings in the Launcher, the Scoring browser tab needs to be refreshed (press F5)
1. Accessing Tournament Setup while logged in as Referee throws you out to the Login screen when you try to save changes. Solution: Log in as Admin.
1. When starting the TMS app, if you click twice, sometimes to instances of the app are opened.