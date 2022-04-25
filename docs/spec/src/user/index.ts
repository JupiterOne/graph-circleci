import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const userSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://circleci.com/api/v2/me/
     * PATTERN: Singleton
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'circleci_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'circleci_user_group_has_user',
        sourceType: 'circleci_user_group',
        _class: RelationshipClass.HAS,
        targetType: 'circleci_user',
      },
    ],
    dependsOn: ['fetch-user-groups'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT:https://circleci.com/api/v2/me/
     * PATTERN: Singleton
     */
    id: 'build-account-and-user-relationships',
    name: 'Build Account and User Relationships',
    entities: [],
    relationships: [
      {
        _type: 'circleci_account_has_user',
        sourceType: 'circleci_account',
        _class: RelationshipClass.HAS,
        targetType: 'circleci_user',
      },
    ],
    dependsOn: ['fetch-account', 'fetch-users'],
    implemented: true,
  },
];
