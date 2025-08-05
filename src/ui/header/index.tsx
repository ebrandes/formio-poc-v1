import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  
  const items = [
    {
      label: "Forms Gallery",
      icon: "pi pi-file-edit",
      command: () => navigate("/forms"),
    },
    {
      label: "Dashboard",
      icon: "pi pi-home",
      command: () => navigate("/dashboard"),
    },
    {
      label: "Formio Admin",
      icon: "pi pi-cog",
      command: () => window.open("http://localhost:3001", "_blank"),
    },
  ];

  const start = (
    <div className="flex items-center gap-2">
      <i className="pi pi-box text-2xl text-blue-600"></i>
      <span className="text-xl font-bold">Formio App</span>
    </div>
  );

  return (
    <div className="shadow z-10">
      <Menubar model={items} start={start} />
    </div>
  );
}
