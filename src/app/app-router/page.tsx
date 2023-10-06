import { TodoSchema } from "@zod-prisma-types";
import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { css } from "styled-system/css";
import Checked from "@/components/Checked";
import Circle from "@/components/Circle";
import Header from "@/components/Header";
import { prisma } from "@/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Todo",
  description: "App Router Todo",
};

const revalidate = () => revalidatePath("/app-router");

const schema = TodoSchema.pick({ title: true });

const Input = (
  props: Omit<JSX.IntrinsicElements["input"], "name"> & {
    name: keyof typeof schema.shape;
  },
) => <input {...props} />;

const getContext = async () => {
  const cookieStore = cookies();
  let sid = cookieStore.get("sid")?.value;

  if (sid) {
    const session = await prisma.session.findUnique({ where: { sid } });

    if (session) {
      return { sessionId: session.id };
    }
  }

  sid = [...crypto.getRandomValues(new Uint32Array(8))].map((m) => m.toString(16).padStart(8, "0")).join("");
  cookieStore.set("sid", sid, { path: "/", httpOnly: true });
  const session = await prisma.session.create({ data: { sid } });

  return { sessionId: session.id };
};

const Main = async () => {
  const { sessionId } = await getContext();
  const todos = await prisma.todo.findMany({ where: { sessionId } });
  const length = todos.length;
  const completed = todos.every(({ completed }) => completed);
  return (
    <main>
      <div className={css({ display: "flex", alignItems: "center", height: "60px", backgroundColor: "#fff" })}>
        <form>
          <button
            className={css({
              width: "40px",
              height: "40px",
              margin: "0px 8px",
              cursor: length ? "pointer" : undefined,
            })}
            formAction={async () => {
              "use server";

              if (length) {
                await prisma.todo.updateMany({ where: { sessionId }, data: { completed: !completed } });
                revalidate();
              }
            }}
          >
            {length ? completed ? <Checked /> : <Circle /> : null}
          </button>
        </form>
        <form
          action={async (formData) => {
            "use server";
            const { title } = schema.parse(Object.fromEntries(formData.entries()));
            await prisma.todo.create({ data: { title, sessionId } });
            revalidate();
          }}
        >
          <Input
            name="title"
            placeholder="What needs to be done?"
            className={css({
              flexGrow: 1,
              margin: "0px 8px",
              height: "60px",
              fontSize: "24px",
              fontWeight: 300,
              "&:focus": { outline: 0 },
              "&::placeholder": { fontStyle: "italic", fontWeight: 300, color: "#e6e6e6" },
            })}
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
            <form>
              <button
                className={css({
                  width: "40px",
                  height: "40px",
                  margin: "0px 8px",
                  cursor: "pointer",
                })}
                formAction={async () => {
                  "use server";
                  await prisma.todo.update({ where: { id }, data: { completed: !completed } });
                  revalidate();
                }}
              >
                {completed ? <Checked /> : <Circle />}
              </button>
            </form>
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
            <form className={css({ visibility: "hidden" })}>
              <button
                className={css({
                  width: "40px",
                  height: "40px",
                  margin: "0px 8px",
                  fontSize: "30px",
                  color: "#cc9a9a",
                  fontWeight: 300,
                  textAlign: "center",
                  cursor: "pointer",
                })}
                formAction={async () => {
                  "use server";
                  await prisma.todo.delete({ where: { id } });
                  revalidate();
                }}
              >
                ×
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default async function AppRouter() {
  return (
    <>
      <Header />
      <Main />
    </>
  );
}
