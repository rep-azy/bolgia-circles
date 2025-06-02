import Image from "next/image";
import AddTask from "./components/AddTask";
import { getAllTodos } from "@/api";
import TodoList from "./components/TodoList";

export default async function Home() {
  const tasks = await getAllTodos();

  return (
    <main className="max-w-4xl mx-auto mt-4">
      <div className="text-center my-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          <img src="/title-2.png" alt="Bolgia" className="inline h-16" />
        </h1>
        <AddTask />
      </div>
      <TodoList tasks={tasks} />
    </main>
  );
}
