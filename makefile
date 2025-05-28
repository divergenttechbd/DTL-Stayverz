run:
	@echo "Run Project"
	@export $(shell xargs < .env); PYTHONPATH=$(PWD) python3 $(PWD)/src/main.py

seed:
	echo "Db Seeding"

docker:
	@echo "building docker file"
	@PYTHONPATH=$(PWD) python3 $(PWD)/src/main.py
	@docker compose up --build --remove-orphans


test:
	@echo "Run Test"
	@poetry shell
	@export $(shell xargs < .env); PYTHONPATH=$(PWD)
	@pytest