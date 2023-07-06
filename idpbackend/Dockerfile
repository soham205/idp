# Use the official Node 18 base image
FROM node:18

# Set the working directory inside the container
RUN mkdir /idpbackend

WORKDIR /idpbackend

COPY . .

RUN npm run build

COPY ./.sequelizerc /idpbackend/build

COPY ./package.json /idpbackend/build

COPY ./.env /idpbackend/build

RUN npm install

COPY ./node_modules /idpbackend/build
 
EXPOSE 3000

# Copy package.json and package-lock.json to the working directory

# Install the dependencies
RUN npm install

# Expose the port your application listens on
EXPOSE 3000

ENTRYPOINT [ "./entrypoint.sh" ]
