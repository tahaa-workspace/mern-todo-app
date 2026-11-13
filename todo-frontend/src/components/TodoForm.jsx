import { useState } from 'react';

function TodoForm({ onAddTodo }) {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        onAddTodo(title.trim());
        setTitle('');
    };

    return (
        <form className='todo-form' onSubmit={handleSubmit}>
            <input type='text' className='todo-input' placeholder='Add a new task...'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <button type='submit' className='add-btn'>Add</button>
        </form>

    );
}

export default TodoForm;