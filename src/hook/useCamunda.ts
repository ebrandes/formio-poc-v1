import axios from "axios";
import { useEffect, useState } from "react";
import { CamundaTask } from "../@types/camunda-task";
import { useFormio } from "./useFormio";
import { formioToCamundaMapper } from "../mapper/formio-to-camunda-mapper";

const camundaApi = axios.create({
  baseURL: import.meta.env.VITE_CAMUNDA_API_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

export const useCamunda = () => {
  const [tasks, setTasks] = useState<CamundaTask[]>([]);
  const { submitForm } = useFormio();

  const submitTaskForm = async (taskId: string, submission: any) => {
    try {
      const result = await submitForm(submission.form, submission);
      const variables = formioToCamundaMapper(submission.data);

      await camundaApi.post(`/task/${taskId}/complete`, {
        variables,
      });

      console.log("Tarefa completada com sucesso no Camunda!");

      await getTasks();

      return result;
    } catch (err) {
      console.error("Erro ao submeter e completar tarefa:", err);
      throw err;
    }
  };

  const claimTask = async (taskId: string) => {
    try {
      const response = await camundaApi.post(`/task/${taskId}/claim`, {
        userId: "demo",
      });
      await getTasks();
      return response.data;
    } catch (error) {
      console.error("Erro ao reivindicar tarefa:", error);
      throw error;
    }
  };

  const getTasks = async () => {
    try {
      const response = await camundaApi.get<CamundaTask[]>("/task");
      const filteredTasks = response.data.filter((task) => task.formKey);
      setTasks(filteredTasks);
      return filteredTasks;
    } catch (error) {
      console.error("Erro ao buscar tasks:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Erro ao buscar tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return { tasks, getTasks, claimTask, submitTaskForm };
};
