install:
	poetry add ${LIB}

remove:
	poetry remove ${LIB}

update:
	poetry update ${LIB}


migrate-apply:
	alembic