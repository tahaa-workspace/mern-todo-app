import os

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from bson import ObjectId
from pymongo import MongoClient
from models import Task


# load_dotenv()

app = FastAPI()
router = APIRouter()

app.add_middleware(CORSMiddleware)

client = MongoClient("mongodb+srv://todoadmin:Todo12345@cluster0.r7rxoc3.mongodb.net/todo_db")
todos_collection = client['todo-db']['todos']

def format_todo(todo):
    return{
        '_id': str(todo['_id']),
        'title': todo['title'],
        'completed': todo['completed']
    }
    
@app.get('/api/todos')
def get_all_tasks():
    tasks = todos_collection.find()
    return [format_todo(t) for t in tasks]

@app.post('/api/todos')
def add_task(task:Task):
    result = todos_collection.insert_one({'title': task.title, 'completed': False})
    new_task = todos_collection.find_one({'_id': result.inserted_id})
    return format_todo(new_task)

@app.put('/api/todos/{id}')
def update_task(id: str, task: Task):
    updates={}
    if task.title is not None:
        updates['title'] = task.title
    if task.completed is not None:
        updates['completed'] = task.completed
    
    todos_collection.update_one({"_id": ObjectId(id)}, {"$set": updates})
    updated_task = todos_collection.find_one({"_id": ObjectId(id)})
    # print(f'updatedTask = {updated_task}')
    return format_todo(updated_task)

    
@app.delete('/api/todos/{id}')
def delete_task(id: str):
    todos_collection.delete_one({ '_id': ObjectId(id)})
    return {'message': 'Task deleted successfully'}

# tasks = [
#     Task(id=1, title= 'T1', completed=False),
#     Task(id=2, title= 'T2', completed=False)
# ]

# @app.get('/tasks')
# def get_all_tasks():
#     return tasks

# @app.post('/tasks')
# def add_task(task: Task):
#     tasks.append(task)
#     return task

# @app.put('/task')
# def update_task(id: int, task: Task):
#     for i in range(len(tasks)):
#         if tasks[i].id == id:
#             tasks[i] = task
#             return 'Task Added Successfully'

# @app.delete('/task/{ id }')
# def delete_task(id: int):
#     for i in range(len(tasks)):
#         if tasks[i].id == id:
#             tasks.remove(tasks[i])
#             return 'Task deleted successfully'
        
#     return f'No task found with id {id}'