
#define app "..\..\dist\win-unpacked"
#define modules "..\..\modules"
#define internals "..\..\internals"
#define executable "FIRST LEGO League TMS.exe"
#define add_firewall_rule "advfirewall firewall add rule protocol=tcp dir=in enable=yes action=allow profile=private"

[Setup]
AppName=FIRST LEGO League TMS
AppVersion=2018.1-beta-1.3
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

[Run]
Filename: "{sys}\netsh.exe";  StatusMsg: "Adding firewall rules..."; Parameters: "{#add_firewall_rule} name=""FIRST LEGO League TMS"" program=""{app}\{#executable}"""
Filename: "{sys}\netsh.exe";  StatusMsg: "Adding firewall rules..."; Parameters: "{#add_firewall_rule} name=""FIRST LEGO League TMS"" program=""{app}\internals\caddy\caddy.exe"""
Filename: "{sys}\netsh.exe";  StatusMsg: "Adding firewall rules..."; Parameters: "{#add_firewall_rule} name=""FIRST LEGO League TMS"" program=""{app}\internals\mongo\bin\mongod.exe"""

[Icons]
Name: "{commondesktop}\FIRST LEGO League TMS"; Filename: "{app}\{#executable}"
Name: "{commonprograms}\FIRST LEGO League TMS"; Filename: "{app}\{#executable}"

[UninstallDelete]
Type: filesandordirs; Name: "{app}\data"
Type: filesandordirs; Name: "{app}\logs"
Type: filesandordirs; Name: "{app}\tmp"

[UninstallRun]
Filename: "{sys}\netsh.exe";  StatusMsg: "Adding firewall rules..."; Parameters: "advfirewall firewall delete rule name=""FIRST LEGO League TMS"""

