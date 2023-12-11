// app.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './TodoList';
import TodoForm from './TodoForm'; // Hinzugefügt
import './styles.css';
import { Todo } from './Todo';

const App: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        getAllTodos();
    }, []);

    const getAllTodos = () => {
        axios.get<Todo[]>('/api/todo')
            .then(response => setTodos(response.data))
            .catch(error => console.error('Fehler beim Laden der Todos:', error));
    };

    const addTodo = (newTodo: Todo) => {
        axios.post<Todo>('/api/todo', newTodo)
            .then(response => {
                setTodos([...todos, response.data]);
            })
            .catch(error => console.error('Fehler beim Hinzufügen eines neuen Todos:', error));
    };

    return (
        <div>
            <h1>Todo App</h1>
            <TodoList todos={todos} />
            <TodoForm onAddTodo={addTodo} />
        </div>
    );
};

export default App;