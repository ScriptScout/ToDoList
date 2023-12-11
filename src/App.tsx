// App.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoList from "./TodoList";
import TodoColumn from "./TodoColumn";
import "./App.css"; // Importiere die CSS-Datei

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

// App-Komponente
class App extends React.Component {
    state = {
        todos: [] as Todo[],
        input: "",
        editingTodo: null as Todo | null,
    };

    componentDidMount() {
        axios
            .get<Todo[]>("/api/todo")
            .then((response) => {
                this.setState({ todos: response.data });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ input: event.target.value });
    };

    handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { editingTodo, input, todos } = this.state;

        if (editingTodo) {
            this.handleEditFormSubmit(event, editingTodo);
        } else {
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

    handleEditClick = (todo: Todo) => {
        this.setState({ editingTodo: todo, input: todo.description });
    };

    handleEditFormSubmit = (
        event: React.FormEvent<HTMLFormElement>,
        todo: Todo
    ) => {
        event.preventDefault();
        const { input, todos } = this.state;

        const updatedTodo: Todo = {
            ...todo,
            description: input,
        };

        axios
            .put<Todo>(`/api/todo/${todo.id}`, updatedTodo)
            .then((response) => {
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

    handleStatusChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
        todo: Todo
    ) => {
        const { todos } = this.state;

        const updatedTodo: Todo = {
            ...todo,
            status: event.target.value as TodoStatus,
        };

        axios
            .put<Todo>(`/api/todo/${todo.id}`, updatedTodo)
            .then((response) => {
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

    handleDeleteClick = (todo: Todo) => {
        const { todos } = this.state;

        axios
            .delete(`/api/todo/${todo.id}`)
            .then(() => {
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

        return (
            <div className="App">
                <h1>Todo App</h1>
                <form onSubmit={this.handleFormSubmit}>
                    <input
                        type="text"
                        value={input}
                        onChange={this.handleInputChange}
                        placeholder="Enter a new todo"
                        required
                    />
                    <button type="submit">
                        {editingTodo ? "Save" : "Add"}
                    </button>
                </form>
                {editingTodo && (
                    <button onClick={() => this.setState({ editingTodo: null })}>
                        Cancel
                    </button>
                )}

                <div className="columns">
                    <TodoColumn
                        title="OPEN"
                        todos={todos.filter((todo) => todo.status === TodoStatus.OPEN)}
                        onEditClick={this.handleEditClick}
                        onDeleteClick={this.handleDeleteClick}
                        onStatusChange={this.handleStatusChange}
                    />
                    <TodoColumn
                        title="IN PROGRESS"
                        todos={todos.filter(
                            (todo) => todo.status === TodoStatus.IN_PROGRESS
                        )}
                        onEditClick={this.handleEditClick}
                        onDeleteClick={this.handleDeleteClick}
                        onStatusChange={this.handleStatusChange}
                    />
                    <TodoColumn
                        title="DONE"
                        todos={todos.filter((todo) => todo.status === TodoStatus.DONE)}
                        onEditClick={this.handleEditClick}
                        onDeleteClick={this.handleDeleteClick}
                        onStatusChange={this.handleStatusChange}
                    />
                </div>
            </div>
        );
    }
}

export default App;
