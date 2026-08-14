import json
import uuid

DATA_FILE = None
storeList = {}

########## SAVE DATA STUFF ###################

def set_data_file_path(path):
    global DATA_FILE
    DATA_FILE = path

def save_data():
    with open(DATA_FILE, "w") as file:
        json.dump(storeList, file, indent=4)

def load_data():
    global storeList
    try:
        with open(DATA_FILE, "r") as file:
            storeList = json.load(file)
    except FileNotFoundError:
        storeList = {}

async def async_load_data(hass):
    set_data_file_path(hass.config.path("multi_list_shopping_data.json"))
    await hass.async_add_executor_job(load_data)

async def async_save_data(hass):
    await hass.async_add_executor_job(save_data)

####### STORE FUNCTIONS #########

def createStore(storeName):  # will also make the store's list
    if storeName == "":
        raise ValueError("Store name cannot be blank")

    if storeName in storeList:
        raise ValueError("Store already exists")

    storeList[storeName] = []
    save_data()


def removeStore(storeName):
    if storeName == "":
        raise ValueError("Store name cannot be blank")

    if storeName not in storeList:
        raise ValueError("Store does not exist")
    del storeList[storeName]
    save_data()

def renameStore(oldName, newName):
    if oldName not in storeList:
        raise ValueError("Store does not exist")
    if newName == "":
        raise ValueError("New store name cannot be blank")
    if newName in storeList:
        raise ValueError("A store with that name already exists")
    storeList[newName] = storeList.pop(oldName)
    save_data()


def get_stores(): #this def can maybe change entierly to just a gui menu showing buttons for each stores. if no stores exist then it will just be a blank page
    return list(storeList.keys())

####### LIST FUNCTIONS ############


def addItem(storeName, itemName, quantity=1, notes="", category=""):
    if storeName == "":
        raise ValueError("Store name cannot be blank")
    if storeName not in storeList:
        raise ValueError("Store does not exist")
    if itemName == "":
        raise ValueError("Item Name cannot be blank")
    if quantity <= 0:
        raise ValueError("quantity cannot be less than 1")

    new_Item = {
        "uid": str(uuid.uuid4()),
        "name": itemName,
        "qty": quantity,
        "notes": notes,
        "category": category,
        "bought": False
    }

    storeList[storeName].append(new_Item)
    save_data()


def remItem(storeName, uid):
    if storeName == "":
        raise ValueError("Store name cannot be blank")

    if storeName not in storeList:
        raise ValueError("Store does not exist")
    
    if not any(item["uid"] == uid for item in storeList[storeName]):
        raise ValueError("Item not found")
    
    storeList[storeName] = [item for item in storeList[storeName] if item["uid"] != uid]
    save_data()

def seeList(storeName):
    if storeName not in storeList:
        raise ValueError("Store does not exist")
    return storeList[storeName]


def clearFullList(storeName):
    if storeName not in storeList:
        raise ValueError("Store does not exist")
    
    storeList[storeName] = []
    save_data()

def clearBought(storeName):
    if storeName not in storeList:
        raise ValueError("Store does not exist")

    storeList[storeName] = [item for item in storeList[storeName] if not item["bought"]]
    save_data()


def toggleBought(storeName, uid):
    if storeName not in storeList:
        raise ValueError("Store does not exist")

    for item in storeList[storeName]:
        if item["uid"] == uid:
            item["bought"] = not item["bought"]
            save_data()
            return

    raise ValueError("Item not found")

def editItem(storeName, itemName, quantity, notes, uid, category=""):
    if storeName not in storeList:
        raise ValueError("Store does not exist")

    for item in storeList[storeName]:
        if item["uid"] == uid:
            item["name"] = itemName
            item["qty"] = quantity
            item["notes"] = notes
            item["category"] = category
            save_data()
            return

    raise ValueError("Item not found")