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

git-push:
	git push --set-upstream origin ${BRANCH}

run:
	poetry run uvicorn app.main:app --host localhost --port 8000 --reload