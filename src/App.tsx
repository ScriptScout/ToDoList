// src/App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Todo {
    id: string;
    description: string;
    status: string;
}

const App: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>('');

    useEffect(() => {
        axios.get('/api/todo')
            .then(response => setTodos(response.data))
            .catch(error => console.error('Fehler beim Laden der Todos:', error));
    }, []);

    const handleAddTodo = () => {
        const todoToAdd: Todo = {
            id: Math.random().toString(36).substring(7),
            description: newTodo,
            status: 'OPEN',
        };

        axios.post('/api/todo', todoToAdd)
            .then(response => setTodos([...todos, response.data]))
            .catch(error => console.error('Fehler beim Hinzufügen des Todos:', error));
    };

    const handleDeleteTodo = (id: string) => {
        axios.delete(`/api/todo/${id}`)
            .then(() => setTodos(todos.filter(todo => todo.id !== id)))
            .catch(error => console.error('Fehler beim Löschen des Todos:', error));
    };

    return (
        <div>
            <h1>Todo List</h1>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {todo.description} - {todo.status}
                        <button onClick={() => handleDeleteTodo(todo.id)}>Löschen</button>
                    </li>
                ))}
            </ul>
            <div>
                <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
                <button onClick={handleAddTodo}>Hinzufügen</button>
            </div>
        </div>
    );
};

export default App;
