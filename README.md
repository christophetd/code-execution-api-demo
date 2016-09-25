This is a sample API using the [Docker Python Sandbox](https://github.com/christophetd/docker-python-sandbox) library.

## Requirements

- Node
- NPM
- Docker

## Installation

- Clone this repository
- Pull the docker image used by the sandbox: `docker pull christophetd/docker-sandbox`
- Copy the sample configuration file: `cp api/config.js.sample api/config.js`
- Run `npm start`
- Navigate to `http://server-ip:3000`
- Enjoy!

## API endpoints (configurable)

#### POST /compile

Requires: 
- A header `Content-Type: application/json`
- A header `X-API-Key: secret api key` (see `api/config.js`)
- A body of the form `{ "code": "code to execute" }`


cURL example: 

```
curl -X POST \
-H "Content-Type: application/json" \
-H "X-API-Key: sdkljf56789#KT34_" \
-d '{ "code": "print \"Hello, world!\" " }' \
localhost:3000/compile

{
 "isError":false,
 "stderr":"",
 "stdout":"Hello, world!\n",
 "combined":"Hello, world!\n",
 "killedByContainer":false
 }
```

See the Docker Sandbox library documentation to know more about the API response format.

## Security considerations

This application showcases an API that should be private. It implements basic security mechanisms that are configurable in the configuration file: 

- rate limitation
- limiting the requests to certain IPs
- authenticating the requests with a secret key

Schema of a proposed architecture:

![copy of docker sandbox server architecture](https://cloud.githubusercontent.com/assets/136675/18363217/da80a65c-7611-11e6-90af-7dfb98f70e71.png)
 
### How to run as non-root

You should NOT run this as root. 

Let me say it again. You should NOT run this as root.

But by default, a non-root user won't be able to use Docker and will cause the Docker Sandbox Library to fail:

```
error: Error: connect EACCESS /var/run/docker.sock
```

The solution for that is to create a separate user to run the API, and to add it to the `docker` group. This will allow him to access the Docker socket.

Example on how to do this:
```
mkdir /home/docker  # Create a home directory
useradd --system --home /home/docker docker-api  # Create the user
chown docker-api:docker-api /home/docker  # Give user ownership of his home directory
usermod -a -G docker docker-api # Add the user to the 'docker' group (automatically created by docker)
```

Then, you'll need to log in as this user using:

```
sudo -Hu docker-api bash
```

And to install the required dependencies if needed (see _Installation_ section). Then, you can run the API using 

```
npm start
```

Or using PM2 

```
which pm2 >/dev/null || npm install -g pm2 # Install pm2 if it is not installed
pm2 start pm2.json
```

### Network configuration

If you have the possibility to do so, create a private network containing your backend and the server running this API, so the API server is only accessible from your backend. You can do this easily for instance using the [Digital Ocean private network feature] (https://www.digitalocean.com/community/tutorials/how-to-set-up-and-use-digitalocean-private-networking)

If you _don't_ have the possibility to do this, I'd recommend the following firewall rules on the API server (examples using ufw)

```
apt-get install ufw

# By default, reject incoming connections
ufw default deny incoming

# By default, reject outgoing connections (optional, more restrictive, and you'll need disable it e.g. to make updates or install stuff)
ufw default deny outgoing

# Allow SSH connections
ufw allow ssh

 # Open the port on which the API will be listening and make it accessible from your backend server
ufw allow from BACKEND_SERVER_IP to any port 3000

# Enable ufw
ufw enable
```
