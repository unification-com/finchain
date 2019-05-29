FROM node:8

WORKDIR "/root"

RUN cd /root && git clone https://github.com/unification-com/wrkchain-validator.git

COPY ./assets/wrkchain_validator.env /root/wrkchain-validator/.env

RUN cd /root/wrkchain-validator && npm install

CMD cd /root/wrkchain-validator && npm start
