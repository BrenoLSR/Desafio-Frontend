import { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

// Função robusta para carregar tarefas do Local Storage
const getInitialTasks = (): Task[] => {
  try {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks) as Task[];
    }
  } catch (e) {
    console.error("Erro ao carregar tarefas do localStorage:", e);
  }
  return [];
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title.trim() || !description.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    setDescription("");
  };

  const toggleCompleted = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addTask();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-700 py-4 sm:py-6 px-4 sm:px-8 text-white">
      
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 sm:mb-10 drop-shadow-lg text-center w-full mx-auto">
        📝 Meu Gerenciador de Tarefas
      </h1>

      {/* Formulário (Quadro 1) */}
      <div className="flex flex-col gap-4 w-full max-w-sm mx-auto bg-purple-900/70 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-purple-600">
        <input
          type="text"
          placeholder="Título da tarefa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          className="p-3 sm:p-4 rounded-xl bg-purple-800/70 text-white placeholder-purple-300 outline-none focus:ring-2 focus:ring-pink-400 transition duration-200"
        />
        <textarea
          placeholder="Descrição da tarefa"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyPress}
          className="p-3 sm:p-4 rounded-xl bg-purple-800/70 text-white placeholder-purple-300 outline-none focus:ring-2 focus:ring-pink-400 transition duration-200 resize-none"
          rows={3}
        />
        <button
          onClick={addTask}
          className="bg-pink-500 hover:bg-pink-600 py-2 sm:py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          Adicionar Tarefa
        </button>
      </div>

      {/* Lista de Tarefas (Quadro 2) */}
      <div 
        className="w-full max-w-sm mx-auto mt-6 sm:mt-10 bg-purple-900/70 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-purple-600"
      >
        {/* ⭐️ AJUSTE AQUI: Adicionado border-0 para a UL também */}
        <ul className="flex flex-col gap-4 w-full border-0">
          {tasks.length === 0 ? (
            <p className="text-purple-200 text-center text-lg">
              Nenhuma tarefa adicionada ainda.
            </p>
          ) : (
            tasks.map((task) => (
              <li
                key={task.id}
                // ⭐️ AJUSTE AQUI: Garantido border-0 (nenhuma borda nativa) para LI
                className="bg-purple-800/50 border border-purple-600 border-0 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-purple-700/70 transition-colors"
              >
                <div className="flex-1 mr-4">
                  <h2
                    className={`font-semibold text-lg ${
                      task.completed
                        ? "line-through text-purple-300"
                        : "text-white"
                    }`}
                  >
                    {task.title}
                  </h2>
                  <p
                    className={`text-purple-200 ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.description}
                  </p>
                  <span
                    className={`mt-1 inline-block font-semibold ${
                      task.completed ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {task.completed ? "Concluída" : "Pendente"}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0 flex-shrink-0">
                  <button
                    onClick={() => toggleCompleted(task.id)}
                    // ⭐️ AJUSTE AQUI: Garantido border-0 para os botões também
                    className={`py-1 px-3 rounded-md font-semibold transition-colors shadow-md text-xs sm:text-sm border-0 ${
                      task.completed
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {task.completed ? "Desmarcar" : "Concluir"}
                  </button>
                  <button
                    onClick={() => removeTask(task.id)}
                    // ⭐️ AJUSTE AQUI: Garantido border-0 para os botões também
                    className="bg-gray-700 hover:bg-gray-800 py-1 px-3 rounded-md font-semibold transition-colors shadow-md text-xs sm:text-sm border-0"
                  >
                    ❌ Remover
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}