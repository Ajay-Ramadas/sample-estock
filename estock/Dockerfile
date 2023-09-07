#A lightweight node image
FROM node:18

#PM2 will be used as PID 1 process
RUN npm install -g pm2@latest

# Copy package json files for services

COPY stock/package.json /var/www/stock/package.json
COPY company/package.json /var/www/company/package.json

# Set up working dir
WORKDIR /var/www

# Install packages
RUN npm config set loglevel warn \
# To mitigate issues with npm saturating the network interface we limit the number of concurrent connections
    && npm config set maxsockets 5 \
    && npm config set only production \
    && npm config set progress false \
    && cd ./stock \
    && npm i \
    && cd ../company \
    && npm i


# Copy source files
COPY . ./

# Expose ports
EXPOSE 8080
EXPOSE 5080

# Start PM2 as PID 1 process
ENTRYPOINT ["pm2", "--no-daemon", "start"]

# Actual script to start can be overridden from `docker run`
CMD ["processes.json"]