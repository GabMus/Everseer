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

var express = require('express');
var router = express.Router();
var sysmon= require('./sysmon').sysmon;
var read=require('fs').readFileSync;

var APIKEY=read(__dirname+'/APIKEY').toString().trim();
/* GET home page. */
router.get('/:key', function(req, res, next) {
  if (req.params.key==APIKEY)
    sysmon.getStats(function(stdout) {
    	res.send(stdout);
    });
  else
    res.sendStatus(401);
});

module.exports = router;
