var remote = require('remote');
var exec=require('child_process').exec;

document.getElementById("min-btn").addEventListener("click", function (e) {
     var window = remote.getCurrentWindow();
     window.minimize();
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
     fs.writeFileSync(__dirname+'/config.json', listToJsonstr(machinesPlots)); //before exiting write new config
     var window = remote.getCurrentWindow();
     window.close();
});

document.getElementById("confirmRemoveMachineButton").addEventListener("click", function (e) {
     plotToDel.remove();
     $('#removeMachineDialog')[0].close();
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
         for (let i=0; i< $('.newMachineField').length; i++) {
             $('.newMachineField')[i].value="";
         }
     }
});
