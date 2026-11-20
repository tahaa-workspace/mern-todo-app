from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Task
from bson import ObjectId
from pymongo import MongoClient

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("mongodb+srv://todoadmin:Todo12345@cluster0.r7rxoc3.mongodb.net/todo_db")
todos_collection = client['todo_db']['todos']

def format_todo(todo):
    return {
        '_id': str(todo['_id']),
        'title': todo['title'],
        'completed': todo.get("completed", False),
    }

@app.get('/api/todos')
def get_tasks():
    tasks = todos_collection.find()
    return [format_todo(t) for t in tasks]

@app.post('/api/todos')
def create_task(task: Task):
    result = todos_collection.insert_one({'title': task.title, 'completed': task.completed})
    new_task = todos_collection.find_one({'_id': result.inserted_id})
    return format_todo(new_task)

@app.put('/api/todos/{id}')
def update_task(id: str, task: Task):
    updates={}
    if task.title is not None:
        updates['title'] = task.title
    if task.completed is not None:
        updates['completed'] = task.completed
    
    todos_collection.update_one({'_id': ObjectId(id)}, {'$set': updates})
    updated_task = todos_collection.find_one({'_id': ObjectId(id)})
    return format_todo(updated_task)
    

@app.delete("/api/todos/{id}")
def delete_task(id: str):
    todos_collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Task deleted successfully"}