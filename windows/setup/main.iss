
#define app "..\bundle\win-unpacked"

[Setup]
AppName=FIRST LEGO League - Scoring System
AppVersion=0.1
DefaultDirName=C:\FLL_ScoringSystem
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64
DisableProgramGroupPage=yes

[Components]
Name: "Basic"; Description: "Basic installation" ; Types: full custom; Flags: fixed
Name: "Plugin_1"; Description: "Plugin 1 for the system" ; Types: full custom;
Name: "Plugin_2"; Description: "Plugin 2 for the system" ; Types: full custom;
Name: "Plugin_3"; Description: "Plugin 3 for the system" ; Types: full custom;
Name: "Plugin_4"; Description: "Plugin 4 for the system" ; Types: full custom;

[Dirs]
Name: "{app}\data"
Name: "{app}\components"

[Files]
Source: "{#app}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs; Components: "Basic";

[Icons]
Name: "{commondesktop}\FIRST LEGO League Scoring"; Filename: "{app}\FIRST LEGO League Launcher.exe"
Name: "{commonprograms}\FIRST LEGO League Scoring"; Filename: "{app}\FIRST LEGO League Launcher.exe"

[UninstallDelete]
Type: filesandordirs; Name: "{app}\data"
