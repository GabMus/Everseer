import subprocess
import psutil

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
	return psutil.cpu_percent(percpu=True)
