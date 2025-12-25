from abc import ABC, abstractmethod

class BaseAgent(ABC):
    def __init__(self, name, description) -> None:
        self.name = name
        self.description = description

    @abstractmethod
    def run(self, payload:dict) -> dict:
        pass