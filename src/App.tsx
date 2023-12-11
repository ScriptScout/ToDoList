// App.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoList from "./TodoList";
import TodoColumn from "./TodoColumn";
import "./App.css"; // Import the CSS file

// Define the Todo type
type Todo = {
    id: string;
    description: string;
    status: TodoStatus;
};

// Define the TodoStatus enum
enum TodoStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

// App component
class App extends React.Component {
    state = {
        todos: [] as Todo[],
        input: "",
        editingTodo: null as Todo | null,
    };

    // Lifecycle method: This is called after the component is added to the DOM
    componentDidMount() {
        // Fetch todos from the backend when the component mounts
        axios
            .get<Todo[]>("/api/todo")
            .then((response) => {
                this.setState({ todos: response.data });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // Handle input change event
    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Update the input value in the state
        this.setState({ input: event.target.value });
    };

    // Handle form submission event
    handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { editingTodo, input, todos } = this.state;

        if (editingTodo) {
            // If editing, submit the updated todo
            this.handleEditFormSubmit(event, editingTodo);
        } else {
            // If not editing, submit a new todo
            const newTodo: Todo = {
                id: "",
                description: input,
                status: TodoStatus.OPEN,
            };
            axios
                .post<Todo>("/api/todo", newTodo)
                .then((response) => {
                    this.setState({
                        todos: [...todos, response.data],
                        input: "",
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    // Handle edit click event
    handleEditClick = (todo: Todo) => {
        // Set the todo to be edited and update the input value
        this.setState({ editingTodo: todo, input: todo.description });
    };

    // Handle edit form submission event
    handleEditFormSubmit = (
        event: React.FormEvent<HTMLFormElement>,
        todo: Todo
    ) => {
        event.preventDefault();
        const { input, todos } = this.state;

        // Submit the updated todo to the backend
        const updatedTodo: Todo = {
            ...todo,
            description: input,
        };

        axios
            .put<Todo>(`/api/todo/${todo.id}`, updatedTodo)
            .then((response) => {
                // Update the state with the updated todo
                this.setState({
                    todos: todos.map((t) =>
                        t.id === response.data.id ? response.data : t
                    ),
                    editingTodo: null,
                    input: "",
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Handle status change event
    handleStatusChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
        todo: Todo
    ) => {
        const { todos } = this.state;

        // Update the todo with the new status
        const updatedTodo: Todo = {
            ...todo,
            status: event.target.value as TodoStatus,
        };

        // Submit the updated todo status to the backend
        axios
            .put<Todo>(`/api/todo/${todo.id}`, updatedTodo)
            .then((response) => {
                // Update the state with the updated todo
                this.setState({
                    todos: todos.map((t) =>
                        t.id === response.data.id ? response.data : t
                    ),
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Handle delete click event
    handleDeleteClick = (todo: Todo) => {
        const { todos } = this.state;

        // Delete the todo from the backend
        axios
            .delete(`/api/todo/${todo.id}`)
            .then(() => {
                // Update the state by removing the deleted todo
                this.setState({
                    todos: todos.filter((t) => t.id !== todo.id),
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        const { todos, input, editingTodo } = this.state;

        // Group the todos by status
        const groupedTodos = todos.reduce(
            (acc: Record<TodoStatus, Todo[]>, todo) => {
                acc[todo.status].push(todo);
                return acc;
            },
            {
                [TodoStatus.OPEN]: [],
                [TodoStatus.IN_PROGRESS]: [],
                [TodoStatus.DONE]: [],
            }
        );

        return (
            <div className="App">
                {/* Trello logo */}
                <img src="https://th.bing.com/th?id=OIP.VoIUtvnEHmq08IiQWEci7AHaEK&w=333&h=187&c=8&rs=1&qlt=90&o=6&dpr=2&pid=3.1&rm=2" alt="Trello logo" className="logo" />

                {/* App title */}
                <h1>Trello Clone</h1>

                {/* Form container */}
                <div className="form-container">
                    <form onSubmit={this.handleFormSubmit}>
                        {/* Input for adding/editing tasks */}
                        <input
                            type="text"
                            value={input}
                            onChange={this.handleInputChange}
                            placeholder="Enter a new task"
                        />
                    </form>

                    {/* Button group for adding/updating tasks and cancelling editing */}
                    <div className="button-group">
                        <button type="submit" form="form">
                            {editingTodo ? "Update" : "Add"}
                        </button>
                        {editingTodo && (
                            <button
                                type="button"
                                className="cancel"
                                onClick={() =>
                                    this.setState({
                                        editingTodo: null,
                                        input: "",
                                    })
                                }
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* Columns for different task statuses */}
                <div className="columns">
                    <TodoColumn
                        title="Open"
                        todos={groupedTodos[TodoStatus.OPEN]}
                        onStatusChange={this.handleStatusChange}
                        onEditClick={this.handleEditClick}
                        onDeleteClick={this.handleDeleteClick}
                    />
                    <TodoColumn
                        title="In Progress"
                        todos={groupedTodos[TodoStatus.IN_PROGRESS]}
                        onStatusChange={this.handleStatusChange}
                        onEditClick={this.handleEditClick}
                        onDeleteClick={this.handleDeleteClick}
                    />
                    <TodoColumn
                        title="Done"
                        todos={groupedTodos[TodoStatus.DONE]}
                        onStatusChange={this.handleStatusChange}
                        onEditClick={this.handleEditClick}
                        onDeleteClick={this.handleDeleteClick}
                    />
                </div>
            </div>
        );
    }
}

export default App;
