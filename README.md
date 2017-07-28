[![Codefresh build status](https://g.codefresh.io/api/badges/build?repoOwner=FirstLegoLeague&repoName=Launcher&branch=master&pipelineName=Launcher&accountName=2roy999&type=cf-1)](https://g.codefresh.io/repositories/FirstLegoLeague/Launcher/builds?filter=trigger:build;branch:master;service:5974fb50aa64aa00013419e3~Launcher)
[![David Dependency Status](https://david-dm.org/FirstLegoLeague/Launcher.png)](https://david-dm.org/FirstLegoLeague/Launcher)
[![David Dev Dependency Status](https://david-dm.org/FirstLegoLeague/Launcher/dev-status.png)](https://david-dm.org/FirstLegoLeague/Launcher#info=devDependencies)

FIRST LEGO League Launcher
==========================

This is the "FIRST LEGO League - Scoring System" Launcher. This project connect
all the scoring system components to create a single execution file.

Using
-----

Currently the launcher is in first alpha step and includes only the
'fllscoring'. To take a look on it you can download is
[here](https://s3.eu-central-1.amazonaws.com/fll-scoring-launcher/FLL-scoring-setup.exe)

Contributing
---------------

To contribute to this repository, please make a fork, make your changes and
submit a pull request.

This way of work allows us to maintain proper code quality, which is important
when working with a large amount of people on the same project. Feel free to
join the discussion on the [issues page](https://github.com/FirstLegoLeague/fllscoring/issues)
.

The best way to work on a feature or a bug is to follow these steps:

- fork the repository to your own github account
- if already forked, make sure your fork is up to date with the base repo
- create a new branch for your feature or bugfix
- work
- test
- create a pull request to merge your development branch into a branch in the
  base repo
- we will review your pull request, when ok, we will merge it into master

In your own fork, you can create any branch structure you like, however, some
best practices / tips are:

- use [git flow](https://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/)
  to structure your branches
- keep pull requests small and concise. Try to limit a pr to only one feature /
  bug fix. We'd rather have many small pull requests than one large one
- keep your fork up to date with the base repo on a regular basis, by rebasing
  against it. This makes sure your pull requests will merge nicely

Development
---------------

### Prerequisites ###

- nodejs (version > 6.11.1)
  - Can be downloaded from [nodejs.org](https://nodejs.org).
- yarn
  - Can be downloaded from [yarnpkg.com](https://yarnpkg.com).
- docker - optional\*
  - Can be download from [docker](https://www.docker.com/)
- shell (`sh`) - optional\*
  - On Mac OS and Linux platforms, `sh` comes with the OS
  - On Windows platform, shell is usually comes with git installation.
    If you are missing it anyway you can use one of the following option:
    - [cygwin](http://www.cygwin.com/)
    - [MinGw](http://www.mingw.org/)

\*Optional - This is needed only for the building of the installation files

### Development Installation ###

- Clone the repository
- Run from cmd `yarn install`

### Run Program Locally ###
The simple way run:
```
yarn start
```

The advanced way (usually if you want to config debug in your ide) run:
```
node ./node_modules/.bin/electron app/main.js
```

### Building ###

To run the build, just use the shell script:
```
./${platform}/build.sh
```

Available platforms:
 - windows
