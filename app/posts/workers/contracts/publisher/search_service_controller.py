class Actions:
    CREATE: str = 'create'
    DELETE: str = 'delete'
    UPDATE: str = 'update'


class SearchPublisherController(Actions):
    EXCHANGE_NAME: str = 'search_service'
    ROUTING_KEY: str = 'post_data'

    @property
    def create_action(self) -> str:
        return self.CREATE

    @property
    def delete_action(self) -> str:
        return self.DELETE

    @property
    def update_action(self) -> str:
        return self.UPDATE

    @property
    def get_exchange_name(self) -> str:
        return self.EXCHANGE_NAME

    @property
    def get_routing_key(self) -> str:
        return self.ROUTING_KEY
