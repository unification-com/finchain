FROM nginx:stable-alpine
# Build args
ARG REST_IP
RUN mkdir -p /www/data/devnet_genesis
COPY proxy/nginx.conf /etc/nginx/conf.d
RUN wget https://raw.githubusercontent.com/unification-com/mainchain/master/Docker/assets/node1/config/genesis.json -O /www/data/devnet_genesis/genesis.json
RUN sed -i "s/172.25.0.6/${REST_IP}/g" /etc/nginx/conf.d/nginx.conf
EXPOSE 1318/tcp
CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]
WORKDIR /usr/share/nginx/html
