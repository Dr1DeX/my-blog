class SearchConsumeController:
    EXCHANGE_NAME: str = 'search_service'
    ROUTING_KEY: str = 'post_data'

    @property
    def get_exchange_name(self):
        return self.EXCHANGE_NAME

    @property
    def get_routing_key(self):
        return self.ROUTING_KEY
