FROM node:6.11.1-wheezy

ENV DEBIAN_FRONTEND noninteractive

RUN dpkg --add-architecture i386

RUN sed -i "s/main/main contrib non-free/" etc/apt/sources.list

RUN apt-get update && apt-get install -yq \
    apt-transport-https \
    curl \
    unrar \
    unzip

RUN curl -fsSL -o Release.key https://dl.winehq.org/wine-builds/Release.key && \
    apt-key add Release.key && \
    echo deb https://dl.winehq.org/wine-builds/debian/ wheezy main | tee /etc/apt/sources.list.d/winehq.list && \
    apt-get update && apt-get install -yq winehq-devel

# innosetup
RUN mkdir innosetup && \
    cd innosetup && \
    curl -fsSL -o innounp045.rar "https://downloads.sourceforge.net/project/innounp/innounp/innounp%200.45/innounp045.rar?r=&ts=1439566551&use_mirror=skylineservers" && \
    unrar e innounp045.rar

RUN cd innosetup && \
    curl -fsSL -o is-unicode.exe http://files.jrsoftware.org/is/5/isetup-5.5.8-unicode.exe && \
    wine "./innounp.exe" -e "is-unicode.exe"

WORKDIR /code

RUN mkdir modules && \
    cd modules && \
    curl -fsSL -o fllscoring.zip https://github.com/FirstLegoLeague/fllscoring/archive/master.zip && \
    unzip fllscoring.zip && \
    mv fllscoring-master fllscoring && \
    rm fllscoring.zip

RUN cd modules/fllscoring && \
    yarn install --production && \
    yarn cache clean

COPY package.json /code/
COPY yarn.lock /code/

RUN yarn install --frozen-lockfile && \
    yarn cache clean

COPY build /code/build
COPY modules /code/modules
COPY app /code/app

RUN yarn build:win -- --c.directories.output=/bundle

COPY windows/setup/* /installer/

WORKDIR /installer

RUN rm -rf /tmp/.wine-0/
RUN wine ../innosetup/ISCC.exe main.iss