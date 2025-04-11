import { Form } from "@formio/react";
import { useEffect, useState } from "react";

const FormioForm = () => {
  const [customReady, setCustomReady] = useState(false);

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

  if (!customReady) return <p>Carregando componentes...</p>;

  return (
    <Form
      src="http://localhost:3001/test"
      onSubmit={(submission) => {
        console.log("Dados enviados:", submission);
      }}
    />
  );
};

export default FormioForm;
