FROM node:16

# Arguments defined in docker-compose.yml
ARG user
ARG uid

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Create system user
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user && \
    chown -R $user:$user /home/$user

RUN npm install jest-cli -g

RUN mkdir /application
WORKDIR /application
USER $user

EXPOSE 1235
EXPOSE 9228
