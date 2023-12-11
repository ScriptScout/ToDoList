// TodoList.tsx
import React from 'react';
import { Todo } from './Todo'; // Importiere die Todo-Definition

interface TodoListProps {
    todos: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
    return (
        <div>
            <h2>Todo List</h2>
            {todos.map(todo => (
                <div key={todo.id}>
                    {todo.description} - {todo.status}
                </div>
            ))}
        </div>
    );
};

export default TodoList;
