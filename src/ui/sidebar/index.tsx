import { PanelMenu } from "primereact/panelmenu";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const navigate = useNavigate();

  const items = [
    {
      label: "Dashboard",
      icon: "pi pi-fw pi-home",
      command: () => navigate("/"),
    },
    {
      label: "Configurações",
      icon: "pi pi-fw pi-cog",
      command: () => navigate("/settings"),
    },
  ];

  return (
    <aside className="w-64 bg-white border-r shadow-sm p-2 hidden md:block">
      <PanelMenu model={items} className="w-full" />
    </aside>
  );
}
