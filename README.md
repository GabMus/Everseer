#Everseer: multi-machine system monitor

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.

![screenshot](screenshot.png)

Everseer is a real system monitor for multiple remote machines. It allows to monitor CPU and memory usage in real time.

It has two parts: a client app, and a server app.

###Client
#####`/everseer_client`

The Everseer client is written using **Electron** (the same technology behind the [Atom text editor](https://atom.io/)). It can be easily run on any platform, including **Linux**, OS X and Windows.

As I don't have any Windows or OS X machines, nor I plan to get any in the future, the main supported platform will be Linux. I will howerver accept bug reports and pull requests specific to those two platforms, and I will do my best to keep the app working well on all platforms.

###Server
#####`/everseer_server`

The server app is exclusively compatible with Linux, since most servers run Linux anyway this shouldn't be a problem. If you need to make the server app compatible with other operating systems, you'll have to edit the server files by yourself.
*Note that the license not only allows this, but also encourages you to. Go ahead, fork it!*

##Installation
###Client

####Arch Linux

Install the `everseer-client-git` package from the **AUR** ([Link](https://aur.archlinux.org/packages/everseer-client-git))

####Other platforms

Download the pre-packaged release for your platform (if it's supported) from the [Releases page](https://github.com/GabMus/Everseer/releases).

####Advanced (useful for development)

- Make sure you have `npm` and `node.js` installed globally in your system
- Clone the repository like this: `git clone https://github.com/GabMus/Everseer`
- `cd` in the `/everseer_client/` directory
- Run `npm start` and the application should be launching correctly

###Server

####Advanced

- Make sure you have `npm`,  `node.js` and `pm2` installed globally in your system
- Clone the repository like this: `git clone https://github.com/GabMus/Everseer`
- `cd` in the `/everseer_server/` directory
- Change the API key in `/everseer_server/routes/index.js` at line 22; the suggested way to easily generate an API key is using the output from `head -n 30 /dev/urandom | sha512sum`
- Run `npm start` and the http server should run on the port 4444 (you can change the port editing the `/everseer-server/bin/www` file, at line 15)