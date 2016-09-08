This is a sample API using the Docker Python Sandbox library.

## Requirements

- Node
- NPM
- Docker

## Installation

- Clone this repository
- Pull the docker image used by the sandbox: `docker pull christophetd/docker-sandbox`
- Copy the sample configuration file: `cp api/config.js.sample api/config.js`
- Run `npm start`
- Navigate to `http://server-ip:300`
- Enjoy!

## Security considerations

This application showcases an API that should be private. It implements basic security mechanisms that are configurable in the configuration file: 

- rate limitation
- limiting the requests to certain IPs
- authenticating the requests with a secret key
 
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

And to install the required dependencies if needed (node, etc.). Then, you can run the API using 

```
npm start
```

Or using PM2 

```
which pm2 >/dev/null || npm install -g pm2 # Install pm2 if it is not installed
pm2 start pm2.json
```
