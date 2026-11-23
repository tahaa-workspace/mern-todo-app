import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Todo from './models/Todo.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching todos', error: error.message });
    }
});

app.post('/api/todos', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || title.trim() === '') {
            res.status(400).json({ message: 'Task Title is required' });
        }
        const newTodo = await Todo.create({ title: title.trim() });

        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating todo', error: error.message });
    }
});

app.put('/api/todos/:id', async (req, res) => {
    try {
        const { title, completed } = req.body;
        const updates = {};

        // Only add fields to 'updates' if the user actually sent them
        if (title !== undefined) updates.title = title.trim();
        if (completed !== undefined) updates.completed = completed;

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID or update data', error: error.message });
    }
    // Find, modify, and .save() -
    //     try {
    //     const todo = await Todo.findById(req.params.id);
    //     if (!todo) return res.status(404).json({ message: 'Todo not found' });

    //     if (req.body.title !== undefined) todo.title = req.body.title.trim();
    //     if (req.body.completed !== undefined) todo.completed = req.body.completed;

    //     const updatedTodo = await todo.save();
    //     res.status(200).json(updatedTodo);
    //   } catch (error) {
    //     res.status(400).json({ message: 'Invalid ID or update data', error: error.message });
    //   }
});

app.delete('/api/todos/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID format', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});