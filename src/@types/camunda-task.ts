export interface CamundaTask {
  id: string;
  name: string;
  assignee: string | null;
  created: string;
  due: string | null;
  followUp: string | null;
  lastUpdated: string | null;
  delegationState: string | null;
  description: string | null;
  executionId: string;
  owner: string | null;
  parentTaskId: string | null;
  priority: number;
  processDefinitionId: string;
  processInstanceId: string;
  taskDefinitionKey: string;
  caseExecutionId: string | null;
  caseInstanceId: string | null;
  caseDefinitionId: string | null;
  suspended: boolean;
  formKey: string;
  camundaFormRef: string | null;
  tenantId: string | null;
  taskState: "Created" | "Assigned" | "Completed" | string;
}
