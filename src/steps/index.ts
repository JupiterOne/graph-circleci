import { accountSteps } from './account';
import { contextsSteps } from './context';
import { jobsSteps } from './job';
import { pipelinesSteps } from './pipeline';
import { projectsSteps } from './project';
import { userSteps } from './user';
import { userGroupsSteps } from './user-groups';
import { workflowsSteps } from './workflow';

const integrationSteps = [
  ...accountSteps,
  ...userGroupsSteps,
  ...pipelinesSteps,
  ...workflowsSteps,
  ...jobsSteps,
  ...projectsSteps,
  ...contextsSteps,
  ...userSteps,
];

export { integrationSteps };
