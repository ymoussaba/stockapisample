FROM node:8

# Create app directory
WORKDIR /Users/ymoussaba/NodeWorkspace/stockapi

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]