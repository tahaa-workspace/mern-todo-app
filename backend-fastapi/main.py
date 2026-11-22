from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from pymongo import MongoClient
from pwdlib import PasswordHash
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

from models import Task, UserAuth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("mongodb+srv://todoadmin:Todo12345@cluster0.r7rxoc3.mongodb.net/todo_db")
todos_collection = client['todo_db']['todos']
users_collection = client['todo_db']['users']

SECRET_KEY= 'supersecretkey12345'
ALGORITHM= 'HS256'
password_hash = PasswordHash.recommended()

def create_token(user_id: str)-> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

security = HTTPBearer()
def get_current_user(credentials:HTTPAuthorizationCredentials = Depends(security))-> str:
    
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload['user_id']
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Not authorized, invalid token")
        

@app.post('/api/auth/register')
def register(user: UserAuth):
    if users_collection.find_one({'email': user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = password_hash.hash(user.password)
    result = users_collection.insert_one({'name': user.name, 'email': user.email, 'password': hashed_password})
    user_id = str(result.inserted_id)
    return {
        'token': create_token(user_id),
        'user': {'id': user_id, 'name': user.name, 'email': user.email}
    }
    
@app.post('/api/auth/login')
def login(user: UserAuth):
    db_user = users_collection.find_one({'email': user.email})
    if not db_user or not password_hash.verify(user.password, db_user['password']):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    user_id = str(db_user['_id'])
    return {
        "token": create_token(user_id),
        "user": {"id": user_id, "name": db_user.get("name"), "email": db_user["email"]}
    }
    
def format_todo(todo):
    return {
        '_id': str(todo['_id']),
        'title': todo['title'],
        'completed': todo.get("completed", False),
    }

@app.get('/api/todos')
def get_tasks(user_id: str = Depends(get_current_user)):
    tasks = todos_collection.find({"user_id": user_id})
    return [format_todo(t) for t in tasks]

@app.post('/api/todos')
def create_task(task: Task, user_id: str = Depends(get_current_user)):
    result = todos_collection.insert_one({
        'user_id': user_id,
        'title': task.title,
        'completed': task.completed
    })
    new_task = todos_collection.find_one({'_id': result.inserted_id})
    return format_todo(new_task)

@app.put('/api/todos/{id}')
def update_task(id: str, task: Task, user_id: str = Depends(get_current_user)):
    updates={}
    if task.title is not None:
        updates['title'] = task.title
    if task.completed is not None:
        updates['completed'] = task.completed
    
    todos_collection.update_one({'_id': ObjectId(id), 'user_id': user_id}, {'$set': updates})
    updated_task = todos_collection.find_one({'_id': ObjectId(id), 'user_id': user_id})
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return format_todo(updated_task)
    

@app.delete("/api/todos/{id}")
def delete_task(id: str, user_id: str = Depends(get_current_user)):
    todos_collection.delete_one({"_id": ObjectId(id), 'user_id': user_id})
    return {"message": "Task deleted successfully"}