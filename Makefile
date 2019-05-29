.DEFAULT_GOAL := up

ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

.PHONY: up
up:
	@test -s $(ROOT_DIR)/.env || { echo "\nERROR!\n\n.env does not exist.\nCopy docker.env to .env and edit as required. Exiting.\n"; exit 1; }
	$(MAKE) down
	@mkdir -p logs
	@docker build -f Docker/und_devnet/base/Dockerfile -t und-devnet-base .
	@docker-compose up --build  2>&1 | tee logs/log.txt

.PHONY: down
down:
	docker-compose down --remove-orphans

.PHONY: logs
logs:
	@sh scripts/split_logs.sh
