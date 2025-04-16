import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { useState } from "react";
import { CamundaTask } from "../../@types/camunda-task";
import FormioForm from "../../formio-components/formio-form/formio-form";
import { useCamunda } from "../../hook/useCamunda";
import { useToast } from "../../hook/useToast";

export const DashboardPage = () => {
  const { tasks, claimTask, getTasks, submitTaskForm } = useCamunda();
  const [selectedTask, setSelectedTask] = useState<CamundaTask | null>(null);
  const { show } = useToast();
  const [sortOption, setSortOption] = useState("oldest-unassigned");

  const handleClaim = async (taskId: string) => {
    try {
      await claimTask(taskId);
      const updatedTasks = await getTasks();
      const updatedTask = updatedTasks.find((t) => t.id === taskId);
      setSelectedTask(updatedTask || null);
      show({
        severity: "success",
        summary: "Sucesso",
        detail: "Tarefa reivindicada com sucesso",
      });
    } catch (err) {
      console.error("Erro ao reivindicar", err);
      show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao reivindicar tarefa",
      });
    }
  };

  const sortOptions = [
    { label: "Mais antiga e não atribuída", value: "oldest-unassigned" },
    { label: "Mais recente", value: "newest" },
    { label: "Por nome", value: "name" },
    { label: "Por responsável", value: "assignee" },
  ];

  const sortedTasks = [...tasks].sort((a, b) => {
    switch (sortOption) {
      case "oldest-unassigned":
        if (!a.assignee && b.assignee) return -1;
        if (a.assignee && !b.assignee) return 1;
        return new Date(a.created).getTime() - new Date(b.created).getTime();

      case "newest":
        return new Date(b.created).getTime() - new Date(a.created).getTime();

      case "name":
        return a.name.localeCompare(b.name);

      case "assignee":
        return (a.assignee || "").localeCompare(b.assignee || "");

      default:
        return 0;
    }
  });

  if (!tasks) return <p className="p-4">Carregando tarefas...</p>;

  return (
    <div className="flex flex-col w-full md:h-[100vh] md:flex-row">
      <aside className="flex flex-col w-full md:h-[100vh] h-[50vh] overflow-y-auto  md:border-r p-4 md:w-1/3 lg:w-1/4">
        <h2 className="mb-4 text-lg font-semibold">Tarefas ({tasks.length})</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700">
            Ordenar por:
          </label>
          <Dropdown
            value={sortOption}
            options={sortOptions}
            onChange={(e) => setSortOption(e.value)}
            className="w-full"
          />
        </div>

        <ul className="space-y-2">
          {sortedTasks?.map((task) => (
            <li
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`cursor-pointer p-3 rounded-md shadow-sm border hover:bg-blue-50 ${
                selectedTask?.id === task.id ? "bg-blue-100" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">{task.name}</span>
                  {task.assignee && (
                    <span className="text-xs text-gray-500">
                      Por: {task.assignee}
                    </span>
                  )}
                </div>
                <Tag
                  value={task.assignee ? "Atribuída" : "Livre"}
                  severity={task.assignee ? "success" : "warning"}
                />
              </div>
              <div className="text-sm text-gray-500">
                Criada há{" "}
                {formatDistanceToNow(new Date(task.created), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Formulário/detalhes */}
      <section className="flex-1 min-h-0 p-4 pt-10 overflow-y-auto bg-white border-t-2 border-gray-200 rounded-md md:p-6">
        {selectedTask ? (
          <div>
            <h2 className="mb-2 text-2xl font-bold">{selectedTask.name}</h2>
            <p className="mb-4 text-gray-600">
              <strong>Estado:</strong> {selectedTask.taskState}
              <br />
              <strong>Formulário:</strong> {selectedTask.formKey || "Nenhum"}
              <br />
              {selectedTask.assignee && (
                <>
                  <strong>Responsável:</strong> {selectedTask.assignee}
                </>
              )}
            </p>

            {!selectedTask.assignee && (
              <Button
                label="Reivindicar tarefa"
                icon="pi pi-user-plus"
                onClick={() => handleClaim(selectedTask.id)}
                className="mb-4 p-button-sm"
              />
            )}

            <div className="flex flex-col items-center justify-center md:p-4 md:mt-4 md:gap-4 ">
              {selectedTask.formKey?.includes("path=") && (
                <FormioForm
                  formKey={selectedTask.formKey}
                  onSubmit={async (submission) => {
                    try {
                      await submitTaskForm(selectedTask.id, submission);
                      await getTasks();
                      setSelectedTask(null);
                      show({
                        severity: "success",
                        summary: "Formulário enviado",
                        detail: "Dados enviados com sucesso.",
                      });
                    } catch (error) {
                      show({
                        severity: "error",
                        summary: "Erro no envio",
                        detail: "Falha ao enviar o formulário.",
                      });
                    }
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">
            Selecione uma tarefa para ver os detalhes e o formulário.
          </p>
        )}
      </section>
    </div>
  );
};
