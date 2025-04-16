import { Menubar } from "primereact/menubar";

export function Header() {
  const items = [
    {
      label: "Camunda Tasklist",
      icon: "pi pi-home",
    },
  ];

  return (
    <div className="shadow z-10">
      <Menubar model={items} />
    </div>
  );
}
