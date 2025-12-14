from typing import Dict, List

from app.services.search_service.fuzzy_search_service import FuzzySearchService
from app.services.search_service.semantic_search_service import SemanticSearchService


class SearchService:

    def __init__(self):
        self.fuzzy = FuzzySearchService()
        self.semantic = SemanticSearchService()

    # def search_by_name(self, query: str, limit: int = 10) -> Dict[str, List]:
    #     restaurants = self.fuzzy.search_restaurant_by_name(query, limit)
    #     dishes = self.fuzzy.search_dish_by_name(query, limit)

    #     if restaurants or dishes:
    #         return {
    #             "mode": "fuzzy",
    #             "restaurants": restaurants,
    #             "dishes": dishes
    #         }

    #     return {
    #         "mode": "semantic",
    #         "restaurants": self.semantic.search_restaurant(query),
    #         "dishes": self.semantic.search_dish(query)
    #     }
