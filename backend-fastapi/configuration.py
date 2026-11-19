from pymongo import MongoClient
from pymongo.server_api import ServerApi

uri="mongodb+srv://todoadmin:Todo12345@cluster0.r7rxoc3.mongodb.net/"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

db = client.todo_db
collection= db['todo_data']