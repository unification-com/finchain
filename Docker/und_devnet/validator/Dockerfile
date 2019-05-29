FROM und-devnet-base

WORKDIR "/root"

# Build args
ARG password
ARG privatekey

RUN echo $password > /root/.accountpassword && \
    echo $privatekey > /root/.privatekey

RUN /root/.go/bin/und --datadir "/root/.und_mainchain" init /root/.und_mainchain/genesis.json
RUN /root/.go/bin/und --datadir "/root/.und_mainchain" account import --password /root/.accountpassword  /root/.privatekey

EXPOSE 30401
EXPOSE 30402
EXPOSE 30403
EXPOSE 8101
EXPOSE 8111
