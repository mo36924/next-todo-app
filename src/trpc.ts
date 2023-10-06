import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";
import { Router } from "@/pages/api/trpc/[trpc]";

export const trpc = createTRPCNext<Router>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: `${typeof window === undefined ? `http://localhost:${process.env.PORT}` : ""}/api/trpc`,
        }),
      ],
      transformer: superjson,
    };
  },
});

export const {
  todos: { useQuery: useTodos },
  addTodo: { useMutation: useAddTodo },
  deleteTodo: { useMutation: useDeleteTodo },
  toggleTodo: { useMutation: useToggleTodo },
  toggleTodos: { useMutation: useToggleTodos },
} = trpc;
