install:
	poetry add ${LIB}

remove:
	poetry remove ${LIB}

update:
	poetry update ${LIB}

migrate-create:
	alembic revision --autogenerate -m ${MIGRATION}

migrate-apply:
	alembic upgrade head

migrate-rollback:
	alembic downgrader ${REVISION}

git-push:
	git push --set-upstream origin ${BRANCH}

run:
	poetry run uvicorn app.main:app --host localhost --port 8001 --reload --env-file ${ENV}