import { CamundaTask } from "./camunda-task";

export interface CamundaTaskList {
  tasks: CamundaTask[];
  total: number;
  size: number;
}
