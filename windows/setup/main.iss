
#define app "..\bundle\win-unpacked"
#define modules "..\bundle\modules"
#define modulesFile "..\bundle\modules.yml"

[Setup]
AppName=FIRST LEGO League - Scoring System
AppVersion=0.1
DefaultDirName=C:\FLL_ScoringSystem
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64
DisableProgramGroupPage=yes

[Components]
Name: "Basic"; Description: "Basic installation" ; Types: full custom; Flags: fixed

[Dirs]
Name: "{app}\data"
Name: "{app}\components"

[Files]
Source: "{#app}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs; Components: "Basic";
Source: "{#modules}\*"; DestDir: "{app}\modules"; Flags: ignoreversion recursesubdirs; Components: "Basic";
Source: "{#modulesFile}"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs; Components: "Basic";

[Icons]
Name: "{commondesktop}\FIRST LEGO League Scoring"; Filename: "{app}\FIRST LEGO League Launcher.exe"
Name: "{commonprograms}\FIRST LEGO League Scoring"; Filename: "{app}\FIRST LEGO League Launcher.exe"

[UninstallDelete]
Type: filesandordirs; Name: "{app}\data"
