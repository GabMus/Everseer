#Everseer: multi-machine system monitor

![screenshot](screenshot.png)

Everseer is a real system monitor for multiple remote machines. It allows to monitor CPU and memory usage in real time.

It has two parts: a client app, and a server app.

###Client
#####`/everseer_client`

The Everseer client is written using **Electron** (the same technology behind the [Atom text editor](https://atom.io/)). It can be easily run on any platform, including **Linux**, OS X and Windows.

As I don't have any Windows or OS X machines, nor I plan to get any in the future, the main supported platform will be Linux. I will howerver accept bug reports and pull requests specific to those two platforms, and I will do my best to keep the app working well on all platforms.

###Server
#####`/everseer_server`

The Everseer server is built using **Django**.

The server app is exclusively compatible with Linux, since most servers run Linux anyway this shouldn't be a problem. If you need to make the server app compatible with other operating systems, all you have to do is edit the `/everseer_server/monitorapi/sysmon.py` file and adapt the system calls to your target system.

##Installation
####Client

*TODO: distribute pre-packaged versions*
#####Advanced (useful for development)

- Make sure you have `npm` and `electron` installed globally in your system
- Clone the repository like this: `git clone https://github.com/GabMus/Everseer`
- `cd` in the `Everseer/everseer_client/` directory
- Run `npm start` and the application should be launching correctly

####Server

- Make sure you have `django` installed (best to install it from `pip`; depending on your distribution the package name could be `python-django` or similar)
- Use your favourite web server to deploy the django app (Apache and nginx are both fine; I won't explain how to deploy the django app myself, since there are many tutorials online, including the django documentation itself)
- Change the API key in `Everseer/everseer_server/monitorapi/views.py`; the suggested way to easily generate an API key is using the output from `head -n 30 /dev/urandom | sha512sum`
