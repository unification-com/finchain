FROM und-devnet-base

WORKDIR "/root"

# Build args
ARG SUBNET_IP
ARG NODE

RUN sed -i "s/172.25.0/${SUBNET_IP}/g" /root/.und_mainchain/${NODE}/config/config.toml
