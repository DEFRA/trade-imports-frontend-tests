FROM node:22.13.1-slim

ENV TZ="Europe/London"

USER root

RUN apt-get update -qq \
    && apt-get install -qqy \
    curl \
    zip \
    openjdk-17-jre-headless

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN npm install

ADD https://dnd2hcwqjlbad.cloudfront.net/binaries/release/latest_unzip/BrowserStackLocal-linux-x64 /root/.browserstack/BrowserStackLocal
RUN chmod +x /root/.browserstack/BrowserStackLocal

COPY . .

ENTRYPOINT [ "./entrypoint.sh" ]

