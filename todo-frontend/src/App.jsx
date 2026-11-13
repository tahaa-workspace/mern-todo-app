import { useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

function App() {
  const [todos, setTodos] = useState([
    { _id: 1, title: 'Build React UI with Vite', completed: true },
    { _id: 2, title: 'Connect Frontend to Express API', completed: false },
  ]);

  const addTodo = (title) => {
    const newTodo = {
      _id: Date.now().toString,
      title,
      completed: false
    };

    const toggleTodo = (id) => {
      setTodos(
        todos.map((todo) => todo._id === id ? { ...todo, completed: !todo.completed } : todo)
      );
    };

    const deleteTodo = (id) => {
      setTodos(todos.filter((todo) => todo._id !== id));
    };


    setTodos([newTodo, ...todos]);
  };

  return (
    <div>
      <h1> MERN To-Do App</h1>
      <TodoForm onAddTodo={addTodo} />

      {todos.length === 0 ? (<p>No tasks yet. Add one above!</p>) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          )
          )}
        </ul>
      )
      };
    </div>
  );
}

export default App;
