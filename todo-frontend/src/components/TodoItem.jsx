function TodoItem({ todo, onToggle, onDelete }) {
    return (
        <li className="todo-item">
            <div className="todo-left" onClick={() => onToggle(todo._id)}>
                <input type="checkbox" checked={todo.completed} onChange={() => { }} />
                <span className={todo.completed ? "completed" : ''}>{todo.title}</span>

            </div>
            <button className="delete-btn" onClick={()=> onDelete(todo._id)}>Delete</button>
        </li>
    );
}

export default TodoItem;