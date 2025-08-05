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

  // Get Formio API URL from environment variable or use default
  const FORMIO_API_URL = import.meta.env.VITE_FORMIO_API_URL || "http://localhost:3001";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/formio.custom.js";
    script.onload = () => {
      console.log("Custom components loaded");
      setTimeout(() => {
        setCustomReady(true);
      }, 2000);
    };
    script.onerror = () => {
      console.warn("Custom components script not found, continuing without custom components");
      setCustomReady(true);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (formKey?.startsWith("embedded:")) {
      const url = new URL(formKey.replace("embedded:", "http://fake"));
      const path = url.searchParams.get("path");
      setFormPath(path);
    } else if (formKey) {
      // Handle direct form paths
      setFormPath(formKey);
    }
  }, [formKey]);

  if (!customReady) return <p>Loading components...</p>;

  if (!formPath) {
    return <p className="text-gray-500">Form not found.</p>;
  }

  return (
    <div className="w-full formio-wrapper">
      <Form
        src={`${FORMIO_API_URL}/${formPath}`}
        onSubmit={(submission) => {
          console.log("Form submission:", submission);
          onSubmit(submission);
        }}
        options={{
          noAlerts: false,
          readOnly: false,
          language: 'en'
        }}
      />
    </div>
  );
};

export default FormioForm;
