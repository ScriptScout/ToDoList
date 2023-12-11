// TodoForm.tsx
import React, { useState } from 'react';
import { Todo } from './Todo';

interface TodoFormProps {
    onAddTodo: (newTodo: Todo) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
    const [newTodoDescription, setNewTodoDescription] = useState('');

    const handleAddTodo = () => {
        const newTodo: Todo = {
            id: '', // Hier sollte das Backend die ID generieren
            description: newTodoDescription,
            status: 'OPEN',
        };

        onAddTodo(newTodo);
        setNewTodoDescription('');
    };

    return (
        <div>
            <form onSubmit={e => { e.preventDefault(); handleAddTodo(); }}>
                <input
                    type="text"
                    value={newTodoDescription}
                    onChange={e => setNewTodoDescription(e.target.value)}
                    placeholder="Neues Todo hinzufügen"
                />
                <button type="submit">Hinzufügen</button>
            </form>
        </div>
    );
};

export default TodoForm;
