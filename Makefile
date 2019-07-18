.DEFAULT_GOAL := up
.EXPORT_ALL_VARIABLES:

ifndef SUBNET_IP
    SUBNET_IP:=172.25.1
endif

.PHONY: up
up:
	@echo "SUBNET_IP = $(SUBNET_IP)"
	@docker-compose down --remove-orphans
	@mkdir -p logs
	@docker build -f Docker/und_devnet/base/Dockerfile -t und-devnet-base .
	@docker-compose up --build 2>&1 | tee logs/log.txt

.PHONY: down
down:
	@docker-compose down --remove-orphans

.PHONY: logs
logs:
	@sh scripts/split_logs.sh

.PHONY: up-slim
up-slim:
	@echo "SUBNET_IP = $(SUBNET_IP)"
	@docker-compose -f docker-compose-slim.yml down --remove-orphans
	@mkdir -p logs
	@docker build --build-arg GENESIS_SUFFIX=-slim -f Docker/und_devnet/base/Dockerfile -t und-devnet-base .
	@docker-compose -f docker-compose-slim.yml up --build 2>&1 | tee logs/log.txt

.PHONY: down-slim
down-slim:
	@docker-compose -f docker-compose-slim.yml down --remove-orphans