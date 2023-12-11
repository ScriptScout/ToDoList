// TodoColumn.tsx
import React from "react";
import TodoList from "./TodoList";

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

interface TodoColumnProps {
    title: string;
    todos: Todo[];
    onEditClick: (todo: Todo) => void;
    onDeleteClick: (todo: Todo) => void;
    onStatusChange: (event: React.ChangeEvent<HTMLSelectElement>, todo: Todo) => void;
}

class TodoColumn extends React.Component<TodoColumnProps> {
    render() {
        const { title, todos, onEditClick, onDeleteClick, onStatusChange } = this.props;

        return (
            <div className="column">
                <h2>{title}</h2>
                <TodoList
                    todos={todos}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    onStatusChange={onStatusChange}
                />
            </div>
        );
    }
}

export default TodoColumn;