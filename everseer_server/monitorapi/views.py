from django.shortcuts import render
from django.http import HttpResponse
from . import sysmon
import json

# Create your views here.

API_KEY='changeme'

def getstats(request, apikey):
    if apikey==API_KEY:
        report={
            'cpufreq': sysmon.getCpuFreq(),
            'cpuusage': sysmon.getCpuUsage(),
            'memoryinfo': sysmon.getMemoryInfo(),
            'uptime': sysmon.getUpTime()
            #'netdevices': sysmon.getNetDeviceList(),
            #'bytesreceived': sysmon.getBytesReceived(),
            #'bytestransmitted': sysmon.getBytesTransmitted()
        }
        return HttpResponse(json.dumps(report))
    else:
        return HttpResponse('Unauthorized')
