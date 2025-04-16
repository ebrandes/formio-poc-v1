import { useContext, createContext, useRef } from "react";
import { Toast } from "primereact/toast";

const ToastContext = createContext<React.RefObject<Toast> | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toastRef = useRef<Toast>(null);

  return (
    <ToastContext.Provider value={toastRef}>
      <Toast ref={toastRef} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used within ToastProvider");

  return {
    show: toast.current?.show,
    ref: toast,
  };
};
