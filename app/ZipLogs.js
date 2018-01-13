const admZip = require('adm-zip');
const path = require('path');
const logPath = path.resolve(process.cwd(), 'log');


let zipLogs = function () {
  let zip = new admZip();
  zip.addLocalFolder(logPath, 'log');
  let now = new Date()
  try {
    zip.writeZip(path.join(require('os').homedir(), 'Desktop', `logs-${now.toDateString()}.zip`))
    alert("You can see the zip file on your desktop");
  } catch (e) {
    console.log(e);
    alert("Oops, Something went wrong \n Please contact your network administrator");
  }
};

module.exports.zipLogs = zipLogs;
