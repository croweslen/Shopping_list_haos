from homeassistant.components.todo import TodoItem, TodoItemStatus, TodoListEntity

class MultiListTodoEntity(TodoListEntity):
    def __init__(self, store_name):
        self._store_name = store_name

    @property
    def todo_items(self):
        items = []
        for grocery_item in storeList[self._store_name]:
            # figure out status here
            # build a TodoItem here
            # append it to items
            return items