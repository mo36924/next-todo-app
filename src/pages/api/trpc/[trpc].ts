import { initTRPC } from "@trpc/server";
import { CreateNextContextOptions, createNextApiHandler } from "@trpc/server/adapters/next";
import { TodoSchema } from "@zod-prisma-types";
import { serialize } from "cookie";
import superjson from "superjson";
import { prisma } from "@/prisma";

const { procedure, router: _router } = initTRPC.context<typeof createContext>().create({ transformer: superjson });

const createContext = async ({ req, res }: CreateNextContextOptions) => {
  let sid = req.cookies.sid;

  if (sid) {
    const session = await prisma.session.findUnique({ where: { sid } });

    if (session) {
      return { sessionId: session.id };
    }
  }

  sid = [...crypto.getRandomValues(new Uint32Array(8))].map((m) => m.toString(16).padStart(8, "0")).join("");
  const cookie = serialize("sid", sid, { path: "/", httpOnly: true });
  res.setHeader("Set-Cookie", cookie);
  const session = await prisma.session.create({ data: { sid } });

  return { sessionId: session.id };
};

const router = _router({
  todos: procedure.query(async ({ ctx: { sessionId } }) => {
    const todos = await prisma.todo.findMany({ where: { sessionId }, orderBy: { id: "asc" } });
    return todos;
  }),
  addTodo: procedure.input(TodoSchema.shape.title).mutation(async ({ ctx: { sessionId }, input: title }) => {
    await prisma.todo.create({ data: { title, sessionId } });
  }),
  deleteTodo: procedure.input(TodoSchema.shape.id).mutation(async ({ input: id }) => {
    await prisma.todo.delete({ where: { id } });
  }),
  toggleTodo: procedure.input(TodoSchema.shape.id).mutation(async ({ input: id }) => {
    const todo = await prisma.todo.findUnique({ where: { id } });

    if (todo) {
      await prisma.todo.update({ where: { id }, data: { completed: !todo.completed } });
    }
  }),
  toggleTodos: procedure.mutation(async ({ ctx: { sessionId } }) => {
    const todos = await prisma.todo.findMany({ where: { sessionId } });

    if (todos.length) {
      await prisma.todo.updateMany({
        where: { sessionId },
        data: { completed: !todos.every(({ completed }) => completed) },
      });
    }
  }),
});

export type Router = typeof router;

export default createNextApiHandler({ router, createContext });
