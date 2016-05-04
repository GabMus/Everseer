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

// importing jQuery
var $ = require('./bower_components/jquery/dist/jquery.min.js');
var ProgressBar = require('./bower_components/progressbar.js/dist/progressbar.min.js');
var Sortable = require('./bower_components/sortable-otherlevels/Sortable.min.js')

var remote = require('remote');
var configFilePath=remote.app.getPath('appData')+"/everseer-client.json";

const fs = require('fs');

var config;
var machinesPlots=[];


function runSsh(address, user, port) {
  if (address == null) return false;
  if (user == null) user="root";
  if (port == null) port=22;
  exec('source '+__dirname+"/openshell.sh "+user+" "+address+" "+port);
}


var protoCard=document.createElement("paper-card");
protoCard.classList.add("machineCard");

function Plot(url_, key_, divclass_, user_) {
	var _this= this;
	this.maxcpuusagevals=30;
	this.divclass=divclass_.replace(/\s+/g, '-');
	this.url=url_;
	this.key=key_;
  if (user_ != null) this.user=user_;
  else this.user="root";
	this.name= divclass_;
	this.cpuusages=[];
	this.active=true;
	this.chartoptions={
		high: 100,
		low: 0,
		showPoint: false,
		lineSmooth: true,
		axisX: {
			showGrid: false,
			showLabel: false
		}
	};

	this.begin = function () {
		_this.active=true;
		_this.drawPlot();
		_this.getNewData();
		checkEmpty();
	}

	this.remove = function() {
		_this.active=false;
		_this.memorybar.destroy();
		_this.newCardContainer.remove();
		machinesPlots.splice(_this.isMe(), 1);
		checkEmpty();
	};

	this.isMe = function() {
		return machinesPlots.indexOf(_this);
	}

	this.getGoodUptime = function(tm) {
		let th; let td;
		if (tm>=60) {
			th=parseInt(tm/60);
			let ftm=th*60;
			tm=tm-ftm;
			if (th>=24) {
				td=parseInt(th/24);
				fth=td*24;
				th=th-fth;
			}
		}
		let toRet="";
		if (td != null) toRet+=td.toString()+"d, ";
		if (th != null) toRet+=th.toString()+"h, ";
		toRet+=parseInt(tm).toString()+"m";
		return toRet;
	}

	this.filterUrlForSsh = function(url) {
		//let usefulpart=/[a-z|0-9|\.]+/gi;
		let pre=/https?:\/\//i;
		let postport=/(:[0-9]+)/gi;
		let postsub=/(\/+[a-z|0-9]*)\/?$/gi;
		return url.replace(pre, "").replace(postport, "").replace(postsub, "");
	}

	this.getNewData = function() {
		if (_this.active) {
			$.getJSON(_this.url+_this.key,
				function( json ) {
		    		for (let i=0; i<json.cpuusage.length; i++) {
	    				if (_this.cpuusages[i]==undefined) _this.cpuusages[i]=[];
	    				_this.cpuusages[i].push(json.cpuusage[i]);
							if (_this.cpuusages[i].length>_this.maxcpuusagevals) _this.cpuusages[i].shift();
	    			}
							_this.memorybar.animate(json.memoryinfo.used/json.memoryinfo.total);
							let gooduptime= _this.getGoodUptime(json.uptime);
							let musedgb= +(json.memoryinfo.used/1000000000).toFixed(2); //bytes to GB
							let mtotalgb= +(json.memoryinfo.total/1000000000).toFixed(2); //bytes to GB
							//note: $('#something') doesn't return an object, but a LIST!
							/*$('#'+_this.divclass+'memorylabel')[0].innerHTML=musedgb.toString()+"/"+mtotalgb.toString()+" GB";
							$('#'+_this.divclass+'clocklabel')[0].innerHTML=json.cpufreq+" MHz";
							$('#'+_this.divclass+'uptimelabel')[0].innerHTML=gooduptime;*/

							_this.newMemoryLabel.textContent=musedgb.toString()+"/"+mtotalgb.toString()+" GB";
							_this.newClockLabel.textContent=json.cpufreq+" MHz";
							_this.newUptimeLabel.textContent=gooduptime;


	         		new Chartist.Line('#'+_this.divclass, {series: _this.cpuusages}, _this.chartoptions);
	         		setTimeout(function() {_this.getNewData();}, 1000);
				}
			);
		}
	};

	this.drawPlot = function() {
		_this.newCard=protoCard.cloneNode(true);
		_this.newCard.id=_this.divclass+"Card";
		_this.newPlotbox=document.createElement('div');
		_this.newPlotbox.classList.add('plotbox');
		_this.newPlot=document.createElement('div');
		_this.newPlot.id=_this.divclass;
		_this.newPlot.classList.add('ct-perfect-fourth');
		_this.newPlotbox.appendChild(_this.newPlot);

		_this.newMemoryBox=document.createElement('div');
		_this.newMemoryBox.classList.add('hbox');

		_this.newMemoryLabel=document.createElement('span');
		_this.newMemoryLabel.classList.add('memorylabel');
		_this.newMemoryLabel.id=_this.divclass+"memorylabel";

		_this.newMemoryBar=document.createElement('div');
		_this.newMemoryBar.id=_this.divclass+"memorybar";
		_this.newMemoryBar.classList.add('memorybar');

		_this.ramIcon=document.createElement('iron-icon');
		_this.ramIcon.setAttribute("icon", "hardware:memory");

		_this.newClockLabel=document.createElement('span');
		_this.newClockLabel.id=_this.divclass+"clocklabel";
		_this.newClockLabel.classList.add('memorylabel');

		_this.newClockBox=document.createElement('div');
		_this.newClockBox.classList.add('hbox');

		_this.clockIcon=document.createElement('iron-icon');
		_this.clockIcon.setAttribute("icon", "schedule");

		_this.newClockBox.appendChild(_this.clockIcon);
		_this.newClockBox.appendChild(_this.newClockLabel);

		//let uptimeBox=document.createElement('div');
		//uptimeBox.classList.add('hbox');

		_this.spanflex=document.createElement('span');
		_this.spanflex.classList.add('flexchild');

		_this.newUptimeLabel=document.createElement('span');
		_this.newUptimeLabel.id=_this.divclass+"uptimelabel";
		_this.newUptimeLabel.classList.add('memorylabel');

		_this.uptimeIcon=document.createElement('iron-icon');
		_this.uptimeIcon.setAttribute("icon", "date-range");

		_this.newClockBox.appendChild(_this.spanflex);
		_this.newClockBox.appendChild(_this.newUptimeLabel);
		_this.newClockBox.appendChild(_this.uptimeIcon);

		//uptimeBox.appendChild(uptimeIcon);
		//uptimeBox.appendChild(newUptimeLabel);

		_this.newMemoryBox.appendChild(_this.ramIcon);
		_this.newMemoryBox.appendChild(_this.newMemoryBar);
		_this.newMemoryBox.appendChild(_this.newMemoryLabel);

		_this.removeButton=document.createElement('paper-button');
		_this.removeButton.classList.add('removeButton');
		_this.removeButton.textContent="Remove";
		_this.removeButton.setAttribute("onclick", "openDeleteDialog("+_this.isMe()+");");

		_this.sshButton=document.createElement('paper-button');
		_this.sshButton.classList.add('sshButton');
		_this.sshButton.textContent="SSH";
		let sshUrl=_this.filterUrlForSsh(_this.url);
		console.log(sshUrl);
		_this.sshButton.setAttribute("onclick", "runSsh('"+sshUrl+"', '"+_this.user+"')");

		_this.cardActions=document.createElement('div');
		_this.cardActions.classList.add('card-actions');
		_this.cardActions.appendChild(_this.sshButton);
		_this.cardActions.appendChild(_this.removeButton);

		_this.newCard.setAttribute("heading", _this.name);
		_this.newCard.appendChild(_this.newPlotbox);
		_this.newCard.appendChild(_this.newClockBox);
		//newCard.appendChild(uptimeBox);
		_this.newCard.appendChild(_this.newMemoryBox);
		_this.newCard.appendChild(_this.cardActions);

		_this.newCardContainer=document.createElement('div');
		_this.newCardContainer.id=_this.divclass+"CardContainer";
		_this.newCardContainer.classList.add("machineCardContainer");
		_this.newCardContainer.appendChild(_this.newCard);

		$("#plotsContainer").append(_this.newCardContainer);

		_this.memorybar=new ProgressBar.Line('#'+_this.divclass+'memorybar', {
			color: '#F4C63D',
			trailColor: '#323644',
			trailWidth: 2,
			strokeWidth: 2
		});
	}
};

function readConfig() {
	fs.readFile(configFilePath, 'utf-8', function(err, data) {
	  if (err || data == null || data=="") {
			//first start, create config file
	    fs.writeFile(configFilePath, '{\n"machines" : [\n]\n}');
	    //console.log(err);
	  }
	  else {
			config=JSON.parse(data);
			initMachines();
	  }
	});
	checkEmpty();
}

var plotToDel=null;

function openDeleteDialog(index) {
	plotToDel=machinesPlots[index];
	$('#removeMachineName')[0].textContent=plotToDel.name;
	$('#removeMachineDialog')[0].open();
}

readConfig();

function initMachines() {
	clearPlots();
	for (let i=0; i<config.machines.length; i++) {
		addMachine(
			config.machines[i].url,
			config.machines[i].key,
			config.machines[i].name,
      config.machines[i].user);
	}
}

function checkEmpty() {
	if (machinesPlots == null || machinesPlots.length==0) {
		let beginMessage=document.createElement('span');
		beginMessage.classList.add('beginMsg');
		beginMessage.innerHTML="There are no machines configured.<br />Press the <iron-icon icon='av:add-to-queue'></iron-icon> button to add a new one.";
		$(".content")[0].appendChild(beginMessage);
	}
	else {
		let torm =$(".beginMsg")[0];
		if (torm != null) torm.remove();
		//initMachines();
	}
}

function clearPlots() {
	for (let i=0; i<machinesPlots.length; i++) {
		machinesPlots[i].remove();
	}
	machinesPlots=[];
}

function addMachine(url, key, name, user) {
	let m={
		url: url,
		key: key,
		name: name,
    user: user
	}
	let p=new Plot(url, key, name, user)
	//config.machines.push(m);
	machinesPlots.push(p);
	p.begin();
}

function listToJsonstr(arr) {
	let stbJson= { machines: [] }; //stb=soon to be
	for (let i=0; i<arr.length; i++) {
		let nm= {
			name: arr[i].name,
			url: arr[i].url,
			key: arr[i].key,
      user: arr[i].user
		};
		stbJson.machines.push(nm);
	}
	return JSON.stringify(stbJson);
}

var el = document.getElementById('plotsContainer');
var sortable = Sortable.create(el, {
	/*onUpdate: function (evt) {
		console.log(evt);
        var itemEl = evt.item;  // dragged HTMLElement
        // + indexes from onEnd
    }*/
});
