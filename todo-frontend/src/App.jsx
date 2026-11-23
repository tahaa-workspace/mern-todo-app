import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

const API_URL = 'http://localhost:5000/api/todos';
// const API_URL = 'http://localhost:8000/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. READ: Fetch all todos when the component first mounts
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setError(null);
        const response = await fetch(API_URL);
        // console.log(`response = ${response}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tasks from server');
        }
        const data = await response.json();
        // console.log(`data = ${data}`);
        setTodos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []); // Empty array [] means run once on initial page load

  // 2. CREATE: Send POST request to save new task in MongoDB
  const addTodo = async (title) => {
    try {
      setError(null);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const savedTodo = await response.json(); // Contains real MongoDB _id
      setTodos([savedTodo, ...todos]);
    } catch (err) {
      setError(err.message);
    }
  };

  // 3. UPDATE: Send PUT request to toggle completed status
  const toggleTodo = async (id) => {
    const targetTodo = todos.find((t) => t._id === id);
    if (!targetTodo) return;

    try {
      setError(null);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !targetTodo.completed })
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTodo = await response.json();
      setTodos(
        todos.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // 4. DELETE: Send DELETE request to remove task from MongoDB
  const deleteTodo = async (id) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container">
      <h1>MERN To-Do App</h1>
      <TodoForm onAddTodo={addTodo} />

      {error && <p className="error-msg">{error}</p>}

      {loading ? (
        <p className="status-msg">Loading tasks...</p>
      ) : todos.length === 0 ? (
        <p className="empty-msg">No tasks yet. Add one above!</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;