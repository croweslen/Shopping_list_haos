# imports
import time
import json

DATA_FILE = "shopping_data.json"

storeList = {}
running = True

###########MENU FUNCTIONS ###########

def mainMenu():
    while running:
        print("""What would you like to do today?

        1 - Enter Shopping Mode
        2 - Edit shopping lists
        3 - Store Menu
        4 - Exit
""")

        answer = input("Choice: ").strip()

        if answer == "1":
            shoppingMode()#enters shopping mode

        elif answer == "2":
            editList()# create new shopping list

        elif answer == "3":
            store_menu() # store name mgmt

        elif answer == "4":
            exit_program()

        else:
            print("Invalid answer, try again")


## ################SHOPPING LIST MANAGEMENT##################

def editList():
    selected_store = selectStore()
    editing = True

    if selected_store is None:
        return

    print(f"Okay, you selected {selected_store}")

    while editing:
        print("""What would you like to do?
        1 - Add item
        2 - Remove Item
        3 - Clear List
        4 - See current list    
        5 - Return to previous menu""")

        editChoice = input("Choose: ").strip()

        if editChoice == "1":  ## add item name, add quantity
            while True:
                print("Okay, what item are you adding to the list?")
                item = input("Item name: ").strip()

                if item == "":
                    print("no input detected, try again")
                    continue

                itemQty = input("Quantity: ").strip()

                if itemQty == "":
                    itemQty = "1"

                elif not itemQty.isdigit():
                    print("Invalid input for quantity, try again")
                    continue

                itemQty = int(itemQty)

                if itemQty <= 0:
                    print("Number was less than 0, try again")
                    continue

                grocery_item = {
                    "name": item,
                    "quantity": itemQty,
                    "bought": False
                }

                print(f"Okay adding {item} x{itemQty} to the list")
                storeList[selected_store].append(grocery_item)
                save_data()

                break

        elif editChoice == "2":
            ##remove item
           
            pass

        elif editChoice == "3":
            ## clear list
            clearList(selected_store)
            pass

        elif editChoice == "4":
            # see full list 
            showItems(selected_store)
            pass


        elif editChoice == "5":
            print("Okay, returning to edit list menu")
            return

        else:
            print("Invalid option, try again")
            continue


def removeItem(selected_store):
    print(f"Okay, which item would you like to remove from the {selected_store} list?")
    pass
def showItems(selected_store):
    print(f"Showing list for {selected_store}")

    items = storeList[selected_store]

    if not items:
        print("This list is empty.")
        return

    count = 1
    for item in items:
        status = "bought" if item["bought"] else "not bought"
        print(f"{count}. {item['name']} x{item['quantity']} - {status}")
        count += 1
    pass

def clearList(selected_store):
    print(f"""Okay, about to clear the {selected_store} list, are you sure? 
          
     Y for yes, N for no""")
    clearListChoice = True
    while clearListChoice:
        clearListChoice = input("Choice: ")
        if clearListChoice == "Y":
             print(f"Okay, clearing list for {selected_store}")
             storeList[selected_store] = []
             save_data()
             time.sleep(1)
             print(f"Okay, shopping list cleared for {selected_store}")
             return
        elif clearListChoice == "N":
             print("Okay, returning to main menu")
             return
        else:
            print("Invalid choice, try again")
            continue

    pass

def shoppingMode():#enters shopping mode |||||||||| pick store, show items, mark/unmark as purchased, finish and clear list
    print("What store are you shopping at?")
    showStoreList()
    

    
    pass



#############STORE MANAGEMENT####################


def store_menu():
    print("""Okay what would you like to do?
          1 - See store list
          2 - Create a new Store
          3 - Delete store
          4 - Return to main menu """)

    sm_answer = input("Choice: ").strip()

    if sm_answer == "1":
        time.sleep(1)
        print("Okay, heres the store list")
        showStoreList()
    elif sm_answer =="2":
        create_store()
    elif sm_answer == "3":
        pass
    elif sm_answer == "4":
        return

def create_store():
    while True:
        print("Okay, please type the store name: ")
        storeName = input("Store name : ").strip()

        if storeName == "":
            print("Your store name cannot be blank, try again")
            continue

        elif storeName in storeList:
            print("This already exists, try again")
            continue

        storeList[storeName] = []
        print(f"{storeName} has been added.")
        save_data()
        return
  
def showStoreList():# shows list of stores
    if not storeList:
        print("No stores created yet.")
    else:
        print("Current stores:")

        count = 1
        for store in storeList:
            print(f"{count}. {store}")
            count += 1
    return

def deleteStore():
    pass

def selectStore():
    selectStoreLoop = True
    while selectStoreLoop:
        print("To exit type exit")
        if not storeList:
            print("No stores created yet, make a store")
            return None

        stores = list(storeList.keys())

        print("Select a store: ")

        count = 1

        for store in stores:
            print(f"{count} - {store}")
            count += 1

        choice = input("Choice: ").strip()

        if choice == "exit":
            print("returning to main menu")
            return None

        if not choice.isdigit():
            print("Invalid choice, please enter a number")
            continue

        choice = int(choice)

        if choice < 1 or choice > len(stores):
            print("Invalid store number")
            continue
        
        select_store = stores[choice - 1]
        return select_store


###################ADMIN FUNCTIONS


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

def exit_program():
    global running
    print("Okay, exiting now")
    running = False

        
## program begins here

print("Hello and welcome to the shopping list applicaiton ")
print("Loading main menu....")
time.sleep(1)
load_data()
mainMenu()

