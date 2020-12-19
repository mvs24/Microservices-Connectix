FROM node:14.2

WORKDIR /usr/app

COPY . .
COPY ./package.json ./package.json
RUN npm cache clean --force
RUN rm -rf node_modules
RUN rm -rf package-lock.json
RUN npm install npm@6.14.9
RUN npm install  core-js@3
RUN npm i core-util-is
RUN npm install 

CMD ["npm ","start"];