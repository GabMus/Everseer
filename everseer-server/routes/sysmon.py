#!/usr/bin/env python3
#    This file is part of Everseer.
#
#    Everseer is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    Everseer is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with Everseer.  If not, see <http://www.gnu.org/licenses/>.

import subprocess
import psutil
import json

def sysrun(command): #run command from string, returns output
	return subprocess.check_output(command.split()).decode()

def fts(path):
	return open(path, "r").read()

def getMemoryInfo(): #in bytes
	out=sysrun('free -b').split()
	toret={
	'total': out[7],
	'used': out[8],
	'free': out[9]
	}
	return toret

def getUpTime(): #uptime in minutes
	return float(fts('/proc/uptime').split()[0])/60

def getCpuFreq(): #get current CPU frequency in MHz
	return float(fts('/sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq')) / 1000 #KHz to MHz

def getNetDeviceList():
	return sysrun('ls -w 1 /sys/class/net/').split()

def getBytesReceived(): #download speed in bytes
	left='cat /sys/class/net/'
	right='/statistics/rx_bytes'
	intlist=getNetDeviceList()
	toret=dict()
	for i in intlist:
		comm=left+i+right
		toret[i]=sysrun(comm).strip()
	return toret

def getBytesTransmitted(): #upload speed in bytes
	left='cat /sys/class/net/'
	right='/statistics/tx_bytes'
	intlist=getNetDeviceList()
	toret=dict()
	for i in intlist:
		comm=left+i+right
		toret[i]=sysrun(comm).strip()
	return toret

def getCpuUsage():
	toRet=psutil.cpu_percent(percpu=True,interval=1)
	return toRet
    
def getReport():
	toret= {
		'cpufreq': getCpuFreq(),
		'cpuusage': getCpuUsage(),
		'memoryinfo': getMemoryInfo(),
		'uptime': getUpTime()
		#'netdevices': getNetDeviceList(),
		#'bytesreceived': getBytesReceived(),
		#'bytestransmitted': getBytesTransmitted()
	}
	return json.dumps(toret)

print(getReport())
