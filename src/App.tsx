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
                <button type="submit">Add</button>
            </form>
            <ul>
                {todos.map((todo) => (
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
                        <button onClick={() => handleDeleteClick(todo)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;