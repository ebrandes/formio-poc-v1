export function formioToCamundaMapper(data: Record<string, any>) {
  const camundaTypes = {
    string: "String",
    number: "Double",
    boolean: "Boolean",
    object: "Json",
  };

  const variables: Record<string, any> = {};

  Object.entries(data).forEach(([key, value]) => {
    const jsType = typeof value;
    const camundaType =
      camundaTypes[jsType as keyof typeof camundaTypes] || "String";

    variables[key] = {
      value,
      type: camundaType,
    };
  });

  return variables;
}
