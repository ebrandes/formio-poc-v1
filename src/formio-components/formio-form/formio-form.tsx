import { Form } from "@formio/react";
import { useEffect, useState } from "react";
import "./index.css";

interface Props {
  formKey: string;
  onSubmit: (submission: any) => void;
}

const FormioForm = ({ formKey, onSubmit }: Props) => {
  const [customReady, setCustomReady] = useState(false);
  const [formPath, setFormPath] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/formio.custom.js";
    script.onload = () => {
      console.log("Custom components loaded");
      setTimeout(() => {
        setCustomReady(true);
      }, 2000);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (formKey?.startsWith("embedded:")) {
      const url = new URL(formKey.replace("embedded:", "http://fake"));
      const path = url.searchParams.get("path");
      setFormPath(path);
    }
  }, [formKey]);

  if (!customReady) return <p>Carregando componentes...</p>;

  if (!formPath) {
    return <p className="text-gray-500">Formulário não encontrado.</p>;
  }

  return (
    <div className="w-full formio-wrapper">
      <Form
        //Todo: Trocar pelo path,
        src={`http://localhost:3001/${formPath}`}
        onSubmit={(submission) => {
          console.log("Dados enviados:", submission);
          onSubmit(submission);
        }}
      />
    </div>
  );
};

export default FormioForm;
