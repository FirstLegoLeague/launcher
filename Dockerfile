# Dockerfile for FLL scoring software
# change rovitotv to your username
#
# The FLL launcher is an electron-js application that starts a GUI which displays the ip address
# and port numbers of each service.  For some reason the electron-js application starts in debug
# mode but you can turn that off.
#
# to build this docker file:
#   docker image build -f fll_launcher_docker_file -t rovitotv/fll_launcher .
# to run use this command:
#   xhost +SI:localuser:root   # only need this command for Ubuntu Linux
#   docker run --net=host --env="DISPLAY" --volume="$HOME/.Xauthority:/root/.Xauthority:rw" --volume="$HOME/data/fll_springboro_tournament:/usr/local/launcher/data:rw" rovitotv/fll_launcher
#
# watch local firewalls you might have to setup firewall exception or stop the firewall completly
# if the timer doesn't work then the firewall is blocking the messages to the server
# on CentOS 7 use the command 'systemctl stop firewalld' on Ubuntu 18.04 use command 'sudo ufw disable'
FROM ubuntu:18.04

MAINTAINER rovitotv@gmail.com

RUN apt-get -y update
RUN apt-get install -y curl wget git libgtk2.0-0 libgtkextra-dev libgconf2-dev libnss3 libasound2 libxtst-dev libxss1 vim
RUN apt-get install -y build-essential
RUN apt-get install -y x11-apps
RUN apt-get install -y libgtk-3-0
RUN apt-get install -y libx11-xcb1

# nodejs
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get -y update
RUN apt install -y nodejs
RUN node --version

# yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get -y update
RUN apt-get install -y yarn

# download the FLL launcher
WORKDIR /usr/local
# git command gets a specific version
RUN git clone -b v2019.1.2.514 https://github.com/FirstLegoLeague/launcher.git
RUN yarn --version

# build the FLL launcher
# if you receive a network error simply try and build the container again it will work on multiple
# retries
WORKDIR /usr/local/launcher
RUN yarn install
RUN yarn get all # this command creates a non-zero exit code because of a network error
RUN yarn build:dir --linux

# run the launcher
WORKDIR /usr/local/launcher
CMD ["yarn", "start"]