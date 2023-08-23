"use client";

import { Todo } from "@prisma/client";
import { useEffect, useState } from "react";

function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const fetchTodos = async () => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((todos) => setTodos(todos));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return { data: todos, refetch: fetchTodos };
}

export default function Home() {
  const { data, refetch } = useTodos();
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    setTodos(data);
  }, [data]);

  return (
    <>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            value={newTodo}
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                setNewTodo("");

                await fetch("/api/todos", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ title: newTodo }),
                }).then(() => {
                  refetch();
                });
              }
            }}
          />
        </header>

        {/* Should be hidden if no todos available */}
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {/* List items should get the class `editing` when editing and `completed` when marked as completed */}
            {todos.map((todo) => (
              <li className="todo" key={todo.id}>
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={async (e) => {
                      await fetch(`/api/todos/${todo.id}`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          title: todo.title,
                          completed: !todo.completed,
                        }),
                      });
                      refetch();
                    }}
                  />
                  <label>{todo.title}</label>
                  <button
                    className="destroy"
                    onClick={async (e) => {
                      await fetch(`/api/todos/${todo.id}`, {
                        method: "DELETE",
                      }).then(() => {
                        refetch();
                      });
                    }}
                  ></button>
                </div>
                <input className="edit" value="Your todo" />
              </li>
            ))}
            {/* more todos here */}
          </ul>
        </section>

        {/* Should be hidden if no todos available */}
        <footer className="footer">
          {/* This should be `0 items left` by default */}
          <span className="todo-count">
            <strong>0</strong> items left
          </span>
          {/* Remove this if you don't implement routing */}
          <ul className="filters">
            <li>
              <a className="selected" href="#/">
                All
              </a>
            </li>
            <li>
              <a href="#/active">Active</a>
            </li>
            <li>
              <a href="#/completed">Completed</a>
            </li>
          </ul>
          {/* Hidden if no completed items are left ↓ */}
          <button
            className="clear-completed"
            onClick={async (e) => {
              await fetch(`/api/todos/completed`, {
                method: "DELETE",
              }).then(() => {
                refetch();
              });
            }}
          >
            Clear completed
          </button>
        </footer>
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Created by <a href="#">Ahmed Abdallah</a>
        </p>
        <p>
          Inspired by <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  );
}
