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

exports.sysmon=sysmon();
//pm2
var exec=require('child_process').exec;

function sysmon() {
  return {
    getStats: function(callback) {
 		exec('python3 '+__dirname+'/sysmon.py',
 			function (err, stdout, stderr) {
 				callback(stdout);
 			}
      	);
    }
  };
}
