//Caso queira usar custom inputs, descomente o código abaixo

// PrimeTextField.tsx
// import React from "react";
// import { InputText } from "primereact/inputtext";
// import { TextFieldComponent } from "formiojs/components/textfield/TextField";
// import { Components } from "formiojs";
// import "./formio-input";

// export class PrimeTextField extends TextFieldComponent {
//   static schema(...extend: any[]) {
//     return TextFieldComponent.schema({
//       type: "textfield", // sobrescrevendo o 'textfield' nativo
//       label: "Prime Input",
//       key: "textfield",
//       ...extend,
//     });
//   }

//   static get builderInfo() {
//     return {
//       title: "Prime Input",
//       icon: "terminal",
//       group: "basic",
//       documentation: "/userguide/#textfield",
//       weight: 0,
//       schema: PrimeTextField.schema(),
//     };
//   }

//   attachReact(element: any) {
//     // Aqui usamos React de verdade
//     this.reactInstance = this.reactRender(
//       <PrimeInput
//         value={this.dataValue}
//         label={this.component.label}
//         placeholder={this.component.placeholder}
//         disabled={this.component.disabled}
//         onChange={(val: string) => this.updateValue(val)}
//         name={this.component.key}
//       />,
//       element
//     );
//   }
// }

// // Componente React com PrimeReact
// const PrimeInput = ({
//   value,
//   onChange,
//   label,
//   placeholder,
//   disabled,
//   name,
// }: any) => {
//   return (
//     <div className="p-field">
//       {label && <label htmlFor={name}>{label}</label>}
//       <InputText
//         id={name}
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         disabled={disabled}
//         className="p-inputtext"
//       />
//     </div>
//   );
// };

// // Sobrescreve o componente nativo 'textfield'
// Components.setComponent("textfield", PrimeTextField);
