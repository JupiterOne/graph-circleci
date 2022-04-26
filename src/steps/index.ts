import { accountSteps } from './account';
import { pipelinesSteps } from './pipeline';
import { projectsSteps } from './project';
import { userSteps } from './user';
import { userGroupsSteps } from './user-groups';

const integrationSteps = [
  ...accountSteps,
  ...userGroupsSteps,
  ...pipelinesSteps,
  ...projectsSteps,
  ...userSteps,
];

export { integrationSteps };
