// src/hooks/useFormio.ts
import { Formio } from "formiojs";
import { useEffect } from "react";

const baseUrl = import.meta.env.VITE_FORMIO_API_URL; // seu formio backend

export const useFormio = () => {
  Formio.setBaseUrl(baseUrl);

  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:3001/admin/login/submission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify({
        data: {
          email,
          password,
          submit: true,
        },
        state: "submitted",
      }),
    });

    if (!res.ok) {
      throw new Error("Login falhou");
    }

    const token = res.headers.get("x-jwt-token");

    if (token) {
      Formio.setToken(token); // 🔥 necessário para <Form /> funcionar autenticado
      localStorage.setItem("formioToken", token);
      console.log("Login bem-sucedido e token JWT aplicado:", token);
    } else {
      console.warn("Login OK, mas sem token JWT retornado");
    }
  };

  const submitForm = async (formId: string, submission: any) => {
    try {
      const formInstance = new Formio(`${baseUrl}/form/${formId}`);

      const result = await formInstance.saveSubmission(submission, {});

      console.log("Submissão feita com sucesso:", result);
      return result;
    } catch (error) {
      console.error("Erro ao enviar submissão:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loginAsync = async () => {
      try {
        const result = await login(
          import.meta.env.VITE_FORMIO_LOGIN,
          import.meta.env.VITE_FORMIO_PASSWORD
        );
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };
    loginAsync();
  }, []);

  return { login, submitForm };
};
