FROM defradigital/node:latest-24

ENV TZ="Europe/London"

USER root

RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    openjdk17-jre-headless \
    curl \
    aws-cli

# Upgrade npm, then patch the packages npm bundles at vulnerable versions (brace-expansion 5.0.9 /
# tar 7.5.22 / undici 6.28.0 / ip-address 10.5.0 / postcss-selector-parser 7.1.4) that cannot be
# fixed via package.json overrides on a global install. The base image ships npm twice
# (/usr/local/lib/node_modules and /home/node/.npm-global/lib/node_modules); patch both, as
# either copy can be the one npm resolves.
RUN npm install -g npm@12.2.0 && \
    NPM_NM=$(npm root -g)/npm/node_modules && \
    ROOT_NPM_NM=/usr/local/lib/node_modules/npm/node_modules && \
    npm pack --pack-destination /tmp brace-expansion@5.0.12 tar@7.5.22 undici@6.28.1 ip-address@10.7.3 postcss-selector-parser@7.1.6 && \
    rm -rf $NPM_NM/brace-expansion $NPM_NM/tar $NPM_NM/undici $NPM_NM/ip-address $NPM_NM/postcss-selector-parser && \
    mkdir $NPM_NM/brace-expansion $NPM_NM/tar $NPM_NM/undici $NPM_NM/ip-address $NPM_NM/postcss-selector-parser && \
    tar xzf /tmp/brace-expansion-5.0.12.tgz --strip-components=1 -C $NPM_NM/brace-expansion && \
    tar xzf /tmp/tar-7.5.22.tgz --strip-components=1 -C $NPM_NM/tar && \
    tar xzf /tmp/undici-6.28.1.tgz --strip-components=1 -C $NPM_NM/undici && \
    tar xzf /tmp/ip-address-10.7.3.tgz --strip-components=1 -C $NPM_NM/ip-address && \
    tar xzf /tmp/postcss-selector-parser-7.1.6.tgz --strip-components=1 -C $NPM_NM/postcss-selector-parser && \
    for p in brace-expansion tar undici ip-address postcss-selector-parser; do \
      rm -rf $ROOT_NPM_NM/$p && cp -r $NPM_NM/$p $ROOT_NPM_NM/$p; \
    done && \
    rm /tmp/brace-expansion-5.0.12.tgz /tmp/tar-7.5.22.tgz /tmp/undici-6.28.1.tgz /tmp/ip-address-10.7.3.tgz /tmp/postcss-selector-parser-7.1.6.tgz

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
# esbuild has multiple vulnerabilities, unfixed
RUN npm install --omit=optional && \
   rm -f node_modules/esbuild/bin/esbuild && \
   rm -f node_modules/esbuild/lib/downloaded-* && \
   rm -rf node_modules/@esbuild

# Patch vulnerable JARs bundled inside allure-commandline that cannot be upgraded
# via npm (allure bundles specific Jackson/FreeMarker/jsoup versions in its dist):
# - jackson-core 2.22.0 -> 2.22.3 (CVE-2026-89407, CVE-2026-89425)
# - jackson-databind 2.22.1 -> 2.22.3 (CVE-2026-68497, CVE-2026-91776, CVE-2026-91777,
#   CVE-2026-19032, CVE-2026-83557)
# - freemarker 2.3.34 -> 2.3.35 (CVE-2026-84939)
# - jsoup 1.23.1 -> 1.23.2 (CVE-2026-75140)
# The allure launcher hardcodes jar filenames in its CLASSPATH, so we overwrite
# the old jar files with fixed content rather than adding new files.
RUN ALLURE_LIB=node_modules/allure-commandline/dist/lib && \
    JIRA_LIB=node_modules/allure-commandline/dist/plugins/jira-plugin/lib && \
    XRAY_LIB=node_modules/allure-commandline/dist/plugins/xray-plugin/lib && \
    MVN=https://repo1.maven.org/maven2 && \
    curl -sSL -o /tmp/jackson-core-2.22.3.jar \
      $MVN/com/fasterxml/jackson/core/jackson-core/2.22.3/jackson-core-2.22.3.jar && \
    curl -sSL -o /tmp/jackson-databind-2.22.3.jar \
      $MVN/com/fasterxml/jackson/core/jackson-databind/2.22.3/jackson-databind-2.22.3.jar && \
    curl -sSL -o /tmp/freemarker-2.3.35.jar \
      $MVN/org/freemarker/freemarker/2.3.35/freemarker-2.3.35.jar && \
    curl -sSL -o /tmp/jsoup-1.23.2.jar \
      $MVN/org/jsoup/jsoup/1.23.2/jsoup-1.23.2.jar && \
    cp /tmp/jackson-core-2.22.3.jar $ALLURE_LIB/jackson-core-2.22.0.jar && \
    cp /tmp/jackson-core-2.22.3.jar $JIRA_LIB/jackson-core-2.22.0.jar && \
    cp /tmp/jackson-core-2.22.3.jar $XRAY_LIB/jackson-core-2.22.0.jar && \
    cp /tmp/jackson-databind-2.22.3.jar $ALLURE_LIB/jackson-databind-2.22.0.jar && \
    cp /tmp/jackson-databind-2.22.3.jar $JIRA_LIB/jackson-databind-2.22.0.jar && \
    cp /tmp/jackson-databind-2.22.3.jar $XRAY_LIB/jackson-databind-2.22.0.jar && \
    cp /tmp/freemarker-2.3.35.jar $ALLURE_LIB/freemarker-2.3.34.jar && \
    cp /tmp/freemarker-2.3.35.jar $JIRA_LIB/freemarker-2.3.34.jar && \
    cp /tmp/jsoup-1.23.2.jar $ALLURE_LIB/jsoup-1.22.2.jar && \
    rm /tmp/jackson-core-2.22.3.jar /tmp/jackson-databind-2.22.3.jar /tmp/freemarker-2.3.35.jar /tmp/jsoup-1.23.2.jar

ADD https://dnd2hcwqjlbad.cloudfront.net/binaries/release/latest_unzip/BrowserStackLocal-alpine /app/.browserstack/BrowserStackLocal

COPY . .

RUN chmod +x /app/.browserstack/BrowserStackLocal && \
    chown -R node:node /app

USER node

ENTRYPOINT [ "./entrypoint.sh" ]
