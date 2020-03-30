FROM node:13.10.1
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN yarn
COPY . /usr/src/app
RUN yarn build
EXPOSE 8000
CMD [ "npm", "start" ]