import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Todo from './models/Todo.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

// Routes (CRUD)

// READ all todos
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 }); // Newest first
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching todos', error: error.message });
    }
});

// CREATE a new todo
app.post('/api/todos', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Task title is required' });
        }

        const newTodo = await Todo.create({ title: title.trim() });
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating todo', error: error.message });
    }
});

// UPDATE a todo
app.put('/api/todos/:id', async (req, res) => {
    try {
        const { title, completed } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { ...(title !== undefined && { title: title.trim() }), ...(completed !== undefined && { completed }) },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID or update data', error: error.message });
    }
});

// DELETE a todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID format', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});