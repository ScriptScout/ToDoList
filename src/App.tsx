// src/App.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

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

// Define the App component
function App() {
    // Use state hooks to store the todos and the input value
    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState("");
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

    // Use effect hook to fetch the todos from the backend when the component mounts
    useEffect(() => {
        axios
            .get<Todo[]>("/api/todo")
            .then((response) => {
                setTodos(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // Handle the input change event
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    // Handle the form submit event
    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (editingTodo) {
            handleEditFormSubmit(event, editingTodo);
        } else {
            // Create a new todo with the input value and a default status
            const newTodo: Todo = {
                id: "",
                description: input,
                status: TodoStatus.OPEN,
            };
            // Post the new todo to the backend and update the state
            axios
                .post<Todo>("/api/todo", newTodo)
                .then((response) => {
                    setTodos([...todos, response.data]);
                    setInput("");
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    // Handle the edit button click event
    const handleEditClick = (todo: Todo) => {
        setEditingTodo(todo);
        setInput(todo.description); // Set the input value to the current todo description
    };

    // Handle the edit form submit event
    const handleEditFormSubmit = (
        event: React.FormEvent<HTMLFormElement>,
        todo: Todo
    ) => {
        event.preventDefault();
        // Update the todo with the new description
        const updatedTodo: Todo = {
            ...todo,
            description: input,
        };
        // Put the updated todo to the backend and update the state
        axios
            .put<Todo>(`/api/todo/${todo.id}`, updatedTodo)
            .then((response) => {
                setTodos(
                    todos.map((t) => (t.id === response.data.id ? response.data : t))
                );
                setEditingTodo(null);
                setInput("");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Handle the status change event
    const handleStatusChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
        todo: Todo
    ) => {
        // Update the todo with the new status
        const updatedTodo: Todo = {
            ...todo,
            status: event.target.value as TodoStatus,
        };
        // Put the updated todo to the backend and update the state
        axios
            .put<Todo>(`/api/todo/${todo.id}`, updatedTodo)
            .then((response) => {
                setTodos(
                    todos.map((t) => (t.id === response.data.id ? response.data : t))
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Handle the delete button click event
    const handleDeleteClick = (todo: Todo) => {
        // Delete the todo from the backend and update the state
        axios
            .delete(`/api/todo/${todo.id}`)
            .then(() => {
                setTodos(todos.filter((t) => t.id !== todo.id));
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Render the app
    return (
        <div className="App">
            <h1>Todo App</h1>
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Enter a new todo"
                    required
                />
                <button type="submit">{editingTodo ? "Save" : "Add"}</button>
            </form>
            {editingTodo && (
                <button onClick={() => setEditingTodo(null)}>Cancel</button>
            )}

            <div className="columns">
                <div className="column">
                    <h2>OPEN</h2>
                    <ul>
                        {todos
                            .filter((todo) => todo.status === TodoStatus.OPEN)
                            .map((todo) => (
                                <li key={todo.id}>
                                    <span>{todo.description}</span>
                                    <select
                                        value={todo.status}
                                        onChange={(event) => handleStatusChange(event, todo)}
                                    >
                                        <option value={TodoStatus.OPEN}>Open</option>
                                        <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
                                        <option value={TodoStatus.DONE}>Done</option>
                                    </select>
                                    <button onClick={() => handleEditClick(todo)}>Edit</button>
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="column">
                    <h2>IN PROGRESS</h2>
                    <ul>
                        {todos
                            .filter((todo) => todo.status === TodoStatus.IN_PROGRESS)
                            .map((todo) => (
                                <li key={todo.id}>
                                    <span>{todo.description}</span>
                                    <select
                                        value={todo.status}
                                        onChange={(event) => handleStatusChange(event, todo)}
                                    >
                                        <option value={TodoStatus.OPEN}>Open</option>
                                        <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
                                        <option value={TodoStatus.DONE}>Done</option>
                                    </select>
                                    <button onClick={() => handleEditClick(todo)}>Edit</button>
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="column">
                    <h2>DONE</h2>
                    <ul>
                        {todos
                            .filter((todo) => todo.status === TodoStatus.DONE)
                            .map((todo) => (
                                <li key={todo.id}>
                                    <span>{todo.description}</span>
                                    <select
                                        value={todo.status}
                                        onChange={(event) => handleStatusChange(event, todo)}
                                    >
                                        <option value={TodoStatus.OPEN}>Open</option>
                                        <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
                                        <option value={TodoStatus.DONE}>Done</option>
                                    </select>
                                    <button onClick={() => handleEditClick(todo)}>Edit</button>
                                    <button onClick={() => handleDeleteClick(todo)}>Delete</button>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;
