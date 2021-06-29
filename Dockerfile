FROM node:14

WORKDIR /app

ENV PHASE=${PHASE}

COPY . .

RUN yarn run test
RUN yarn run build

ENTRYPOINT ["/usr/local/bin/yarn", "run", "start"]
