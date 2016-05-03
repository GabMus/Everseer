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
