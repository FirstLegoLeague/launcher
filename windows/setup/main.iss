
#define app "..\..\dist\win-unpacked"
#define modules "..\..\modules"
#define internals "..\..\internals"

[Setup]
AppName=FIRST LEGO League TMS
AppVersion=0.1
DefaultDirName=C:\FIRST_Lego_League_TMS
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64
DisableProgramGroupPage=yes

[Dirs]
Name: "{app}\data"
Name: "{app}\logs"
Name: "{app}\tmp"

[Files]
Source: "{#app}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs;
Source: "{#modules}\*"; DestDir: "{app}\modules"; Flags: ignoreversion recursesubdirs;
Source: "{#internals}\*"; DestDir: "{app}\internals"; Flags: ignoreversion recursesubdirs;

[Icons]
Name: "{commondesktop}\FIRST LEGO League TMS"; Filename: "{app}\FIRST LEGO League TMS.exe"
Name: "{commonprograms}\FIRST LEGO League TMS"; Filename: "{app}\FIRST LEGO League TMS.exe"

[UninstallDelete]
Type: filesandordirs; Name: "{app}\data"
Type: filesandordirs; Name: "{app}\logs"
Type: filesandordirs; Name: "{app}\tmp"
