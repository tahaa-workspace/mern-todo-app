import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// 1. Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse incoming JSON payloads into req.body

let todos = [
    {id:1, title: 'Initialize MERN monorepo', completed: true},
    {id:2, title: 'Build express REST API', completed: false}
];

app.get('/api/todos', (req, res)=> {
    res.status(200).json(todos);
});

app.post('/api/todos', (req, res)=> {
    const {title} = req.body;

    if(!title || title.trim() === ''){
        return res.status(400).json({message: 'Task Title is requiresd'});
    }

    const newTodo = {
        id: Date.now(),
        title: title.trim(),
        completed: false
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.put('/api/todos/:id', (req, res)=> {
    const todoId = Number(req.params.id);
    const {title, completed} = req.body;

    const todo = todos.find((t) => t.id === todoId);
    if(!todo){
        return res.status(404).json({message: 'Todo not found'});
    }

    if(title !== undefined) todo.title === title.trim();
    if (completed !== undefined) todo.completed = completed;

    res.status(200).json(todo);
});

app.delete('/api/todos/:id', (req, res)=> {
    const todoId = Number(req.params.id);
    const initialLength = todos.length;

    todos = todos.filter((t)=> t.id !== todoId);

    if(todos.length === initialLength){
        return res.status(404).json({message: 'Todo not found'});
    }

    res.status(200).json({message: 'Todo deleted successfully'});
});

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`);
});