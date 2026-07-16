import json
import uuid

DATA_FILE = "shopping_data.json"
storeList = {}

########## SAVE DATA STUFF ###################
def save_data():
    with open(DATA_FILE, "w") as file:
            json.dump(storeList, file, indent=4)
def load_data():
    global storeList

    try:
        with open(DATA_FILE,  "r") as file:
            storeList = json.load(file)
    except FileNotFoundError:
            storeList = {}
async def async_load_data(hass):
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


def get_stores():
     
    pass

####### LIST FUNCTIONS ############

def editList():
      
    pass

def addItem():
      
    pass

def remItem():
     
    pass

def seeList():
     
    pass

def clearList():
     
    pass

def remBought():
     
    pass


###### Menu Functions

def mainMenu():
    
    pass

def shoppingMode():
     
    pass

def listMenu():
     
    pass