import Head from "next/head";
import { useState } from "react";
import { css } from "styled-system/css";
import Checked from "@/components/Checked";
import Circle from "@/components/Circle";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import { useAddTodo, useDeleteTodo, useTodos, useToggleTodo, useToggleTodos } from "@/trpc";

const Main = () => {
  const [title, setTitle] = useState("");
  const { data: todos, refetch } = useTodos();

  const options = {
    async onSuccess() {
      await refetch();
    },
  };

  const { mutate: addTodo } = useAddTodo(options);
  const { mutate: deleteTodo } = useDeleteTodo(options);
  const { mutate: toggleTodo } = useToggleTodo(options);
  const { mutate: toggleTodos } = useToggleTodos(options);

  return todos ? (
    <main>
      <div className={css({ display: "flex", alignItems: "center", height: "60px", backgroundColor: "#fff" })}>
        <div
          className={css({
            width: "40px",
            height: "40px",
            margin: "0px 8px",
            cursor: length ? "pointer" : undefined,
          })}
          onClick={() => {
            toggleTodos();
          }}
        >
          {todos.length ? todos.every(({ completed }) => completed) ? <Checked /> : <Circle /> : null}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const _title = title.trim();

            if (_title) {
              setTitle("");
              addTodo(_title);
            }
          }}
        >
          <input
            className={css({
              flexGrow: 1,
              margin: "0px 8px",
              height: "60px",
              fontSize: "24px",
              fontWeight: 300,
              "&:focus": { outline: 0 },
              "&::placeholder": { fontStyle: "italic", fontWeight: 300, color: "#e6e6e6" },
            })}
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </form>
      </div>
      <ul>
        {todos.map(({ id, title, completed }) => (
          <li
            key={id}
            className={css({
              display: "flex",
              alignItems: "center",
              height: "60px",
              backgroundColor: "#fff",
              "&:hover > :last-child": { visibility: "visible" },
            })}
          >
            <div
              className={css({
                width: "40px",
                height: "40px",
                margin: "0px 8px",
                cursor: "pointer",
              })}
              onClick={() => {
                toggleTodo(id);
              }}
            >
              {completed ? <Checked /> : <Circle />}
            </div>
            <div
              className={css({
                flexGrow: 1,
                margin: "0px 8px",
                fontSize: "24px",
                fontWeight: 300,
                color: completed ? "#d9d9d9" : undefined,
                transition: "color 0.4s",
                textDecorationLine: completed ? "line-through" : undefined,
              })}
            >
              {title}
            </div>
            <div
              className={css({
                width: "40px",
                height: "40px",
                margin: "0px 8px",
                fontSize: "30px",
                color: "#cc9a9a",
                fontWeight: 300,
                textAlign: "center",
                cursor: "pointer",
                visibility: "hidden",
              })}
              onClick={() => {
                deleteTodo(id);
              }}
            >
              ×
            </div>
          </li>
        ))}
      </ul>
    </main>
  ) : (
    <Loader />
  );
};

export default function PagesRouter() {
  return (
    <>
      <Head>
        <title>Todo</title>
        <meta name="description" content="Pages Router Todo" />
      </Head>
      <Header />
      <Main />
    </>
  );
}
