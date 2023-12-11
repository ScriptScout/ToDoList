// TodoList.tsx
import React from "react";

type Todo = {
    id: string;
    description: string;
    status: TodoStatus;
};

enum TodoStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
};

interface TodoListProps {
    todos: Todo[];
    onEditClick: (todo: Todo) => void;
    onDeleteClick: (todo: Todo) => void;
    onStatusChange: (event: React.ChangeEvent<HTMLSelectElement>, todo: Todo) => void;
}

class TodoList extends React.Component<TodoListProps> {
    render() {
        const { todos, onEditClick, onDeleteClick, onStatusChange } = this.props;

        return (
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <span>{todo.description}</span>
                        <select
                            value={todo.status}
                            onChange={(event) => onStatusChange(event, todo)}
                        >
                            <option value={TodoStatus.OPEN}>Open</option>
                            <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
                            <option value={TodoStatus.DONE}>Done</option>
                        </select>
                        <button onClick={() => onEditClick(todo)}>Edit</button>
                        {todo.status === TodoStatus.DONE && (
                            <button onClick={() => onDeleteClick(todo)}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>
        );
    }
}

export default TodoList;
