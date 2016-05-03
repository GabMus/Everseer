#!/bin/sh

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

comm="ssh $1@$2 -p $3"
command -v xterm > /dev/null && xterm -e $comm || return 1
