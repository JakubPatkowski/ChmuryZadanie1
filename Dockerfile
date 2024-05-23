# syntax = docker/dockerfile:1.3


# --------- ETAP 1 ------------------------

FROM scratch as builder

ADD alpine-minirootfs-3.20.0-x86_64.tar.gz /

LABEL maintainer="Jakub Patkowski"


RUN rm -rf /etc/apk/cache

RUN --mount=type=ssh \
    git clone https://github.com/JakubPatkowski/ChmuryZadanie1 . && \
    addgroup -S node && \
    adduser -S node -G node && \
    rm -rf /var/cache/apk

USER node

WORKDIR /home/node/app

COPY --chown=node:node server.js .

# --------- ETAP 2 ------------------------

FROM node:iron-alpine3.20

ARG VERSION
ENV VERSION=${VERSION:-v1.0.0}

RUN --mount=type=cache,target=/var/cache/apk \
    apk update \
    apk upgrade \
    apk add --no-cache curl=8.7.1-r0
    
USER node
                  
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --from=builder --chown=node:node /home/node/app/server.js ./server.js

EXPOSE 3000

HEALTHCHECK --interval=4s --timeout=20s --start-period=2s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

ENTRYPOINT ["node", "server.js"]
