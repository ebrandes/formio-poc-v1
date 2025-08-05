import { PanelMenu } from "primereact/panelmenu";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const navigate = useNavigate();

  const items = [
    {
      label: "Forms Gallery",
      icon: "pi pi-fw pi-file-edit",
      command: () => navigate("/"),
    },
    {
      label: "Camunda Dashboard",
      icon: "pi pi-fw pi-home",
      command: () => navigate("/dashboard"),
    },
    {
      label: "Formio Admin",
      icon: "pi pi-fw pi-cog",
      command: () => window.open("http://localhost:3001", "_blank"),
    },
  ];

  return (
    <aside className="w-64 bg-white border-r shadow-sm p-2 hidden md:block">
      <PanelMenu model={items} className="w-full" />
    </aside>
  );
}
