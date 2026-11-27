FROM defradigital/node:3.2.4-node24.22.1

ENV TZ="Europe/London"

USER root

RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    openjdk17-jre-headless \
    curl \
    aws-cli

# Upgrade npm, then patch the vulnerable packages bundled with the global CLI.
# The project package.json overrides apply only to project dependencies.
# The earlier patches replace brace-expansion 5.0.9, tar 7.5.22, undici 6.28.1,
# ip-address 10.7.3 and postcss-selector-parser 7.1.4.
# Also replace glob 13.0.6 (CVE-2026-118773) and minimatch 10.2.5 (CVE-2026-118764).
# glob 14 needs path-scurry 3, and minimatch 11 needs nonrecursive-glob-match.
# Patch both npm copies under /usr/local/lib/node_modules and
# /home/node/.npm-global/lib/node_modules, as either can be the one npm resolves.
RUN set -e; \
    npm install -g npm@12.2.0; \
    PATCH_DIR=$(mktemp -d); \
    PACKAGES='brace-expansion@5.0.12 tar@7.5.22 undici@6.29.1 ip-address@10.7.4 postcss-selector-parser@7.1.6 \
      glob@14.0.2 minimatch@11.0.1 path-scurry@3.0.0 @isaacs/nonrecursive-glob-match@1.0.1'; \
    for spec in $PACKAGES; do \
      package=${spec%@*}; \
      archive=$(npm pack --silent --pack-destination "$PATCH_DIR" "$spec"); \
      mkdir -p "$PATCH_DIR/node_modules/$package"; \
      tar xzf "$PATCH_DIR/$archive" --strip-components=1 -C "$PATCH_DIR/node_modules/$package"; \
    done; \
    for npm_modules in "$(npm root -g)/npm/node_modules" /usr/local/lib/node_modules/npm/node_modules; do \
      for spec in $PACKAGES; do \
        package=${spec%@*}; \
        rm -rf "$npm_modules/$package"; \
        mkdir -p "$(dirname "$npm_modules/$package")"; \
        cp -r "$PATCH_DIR/node_modules/$package" "$npm_modules/$package"; \
      done; \
    done; \
    rm -rf "$PATCH_DIR"

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
