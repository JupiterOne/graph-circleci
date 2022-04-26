import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const userGroupsSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://circleci.com/api/v2/me/collaborations
     * PATTERN: Fetch Entities
     */
    id: 'fetch-user-groups',
    name: 'Fetch User Groups',
    entities: [
      {
        resourceName: 'UserGroup',
        _type: 'circleci_user_group',
        _class: ['Group'],
      },
    ],
    relationships: [],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
