FROM golang:1.11

WORKDIR /root
RUN mkdir /root/src
RUN cd /root/src && git clone https://github.com/unification-com/oracle.git && \
    # TODO: remove when merged
    cd oracle && git checkout wrkchain_geth

RUN cd /root/src/oracle && go install ./cmd/wrkoracle
RUN wrkoracle --version

COPY ./assets/run-wrkoracle.sh /root/src/run-wrkoracle.sh
RUN chmod +x /root/src/run-wrkoracle.sh
ADD ./assets/genesis.json /root/.wrkchain_oracle/genesis.json

ARG PRIVATE_KEY
ARG WALLET_PASS

RUN mkdir -p /root/.wrkchain_oracle

RUN echo $WALLET_PASS > /root/.wrkchain_oracle/.password
RUN echo $PRIVATE_KEY > /root/.wrkchain_oracle/.pkey

RUN wrkoracle init --password /root/.wrkchain_oracle/.password --key /root/.wrkchain_oracle/.pkey
