/*
 *    This file is part of Everseer.
 *
 *    Everseer is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    Everseer is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with Everseer.  If not, see <http://www.gnu.org/licenses/>.
 */
var exec=require('child_process').exec;

document.getElementById("min-btn").addEventListener("click", function (e) {
     var window = remote.getCurrentWindow();
     window.minimize();
});

document.getElementById("reloadmachines-btn").addEventListener("click", function (e) {
     reloadMachines();
});

document.getElementById("max-btn").addEventListener("click", function (e) {
     var window = remote.getCurrentWindow();
     if (window.isMaximized()) {
       window.unmaximize();
     }
     else {
       window.maximize();
     }
});

document.getElementById("close-btn").addEventListener("click", function (e) {
     //fs.writeFileSync(configFilePath, listToJsonstr(machinesPlots)); //before exiting write new config
     var window = remote.getCurrentWindow();
     window.close();
});

document.getElementById("confirmRemoveMachineButton").addEventListener("click", function (e) {
     plotToDel.remove();
     $('#removeMachineDialog')[0].close();
     fs.writeFile(configFilePath, listToJsonstr(machinesPlots));
});

document.getElementById("confirmAddMachineButton").addEventListener("click", function (e) {
     let confirm=true;
     let newMachine={};
     for (let i=0; i< $('.newMachineField').length; i++) {
         confirm = $('.newMachineField')[i].validate() && confirm;
     }
     if (confirm) {
         $('#addMachineDialog')[0].close();
         if ($('.newMachineField')[1].value[$('.newMachineField')[1].value.length-1] != "/")
            $('.newMachineField')[1].value+="/";
        if ($('.newMachineField')[1].value.substring(0,7) != "http://" || $('.newMachineField')[1].value.substring(0,8) != "https://")
            $('.newMachineField')[1].value="http://"+$('.newMachineField')[1].value;
         addMachine(
             newMachine.url=$('.newMachineField')[1].value,
             newMachine.key=$('.newMachineField')[2].value,
             newMachine.name=$('.newMachineField')[0].value,
             newMachine.user=$('.newMachineField')[3].value
         );
         fs.writeFileSync(configFilePath, listToJsonstr(machinesPlots));
         for (let i=0; i< $('.newMachineField').length; i++) {
             $('.newMachineField')[i].value="";
         }
     }
});
