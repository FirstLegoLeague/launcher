[![Build status](https://ci.appveyor.com/api/projects/status/0y2bsm8ku11q6vyt?svg=true)](https://ci.appveyor.com/project/2roy999/launcher-8a1fe)
[![David Dependency Status](https://david-dm.org/FirstLegoLeague/Launcher.png)](https://david-dm.org/FirstLegoLeague/Launcher)
[![David Dev Dependency Status](https://david-dm.org/FirstLegoLeague/Launcher/dev-status.png)](https://david-dm.org/FirstLegoLeague/Launcher#info=devDependencies)

# _FIRST_ LEGO League TMS Launcher 

This is the "_FIRST_ LEGO League - Tournament Management System" Launcher. This project connect
 all the tournament management system components to create a single
 user-friendly application.

## Using

You can find the installation file of the launcher at the _FIRST_ LEGO League
 software page [here](http://www.fll-tools.com/software/).

## Contributing

To contribute to this repository, please make a fork, make your changes and
 submit a pull request.

This way of work allows us to maintain proper code quality, which is important
 when working with a large amount of people on the same project. Feel free to
 join the discussion on the
 [issues page](https://github.com/FirstLegoLeague/fllscoring/issues).

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

## Updates

### Module updates

To update a module versions in the launcher, make a change in
 `./dev-scripts/config-get.js`. Some modules are fetched from the npm, the
 Javascript Package Manager, while others are taken directly from github.

- To update a module fetched from `npm`, update the version field with the version published to npm.
- To update a module fetched from `github`, update the version field with the github commit hash.

| Module | npm / github |
| --- | --- |
|identity-provider|github|
|display|npm|
|tournament|npm|
|scoring|npm|
|rankings|github
|clock|github|

### Launcher version update

TBD

## Development

### Prerequisites

- nodejs (version >= 8.2.1)
  - Can be downloaded from [nodejs.org](https://nodejs.org).
- yarn
  - Can be downloaded from [yarnpkg.com](https://yarnpkg.com).

### Development Installation

- Clone the repository
- Run from cmd `yarn install`
- Run from cmd `yarn get all` - this would download all external
  modules for the launcher. Use `yarn get --help` to change the modules
  that you want to download.

### Run Program Locally

The simple way run:
```
yarn start
```

The advanced way (usually if you want to config debug in your ide) run:
```
node ./node_modules/.bin/electron app/main.js
```

### Debugging Node Modules

While running the launcher in development mode, each of the node modules is
 given a port for debug with the port `1####` where `####` is the main port of
 the module itself. To use connect use your node debugger (For more
 information: [node-debugging](https://nodejs.org/en/docs/guides/debugging-getting-started/)) 

### Building

To run the build, use the following script:
```
yarn build:$paltform$
```
where `$platform$` must be replaced with either `win` or `linux` depend on
 your environment. You would be able to find the artifact in the `./dist`
 project in your project files. 

NOTE: the build script is not cross-compile script, si you should be run
 the script on the platform to which your installation is desired.

Official platforms:
 - windows
