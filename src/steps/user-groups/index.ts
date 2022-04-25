import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import {
  Entities,
  Relationships,
  Steps,
  ACCOUNT_ENTITY_KEY,
} from '../constants';
import { createUserGroupEntity } from './converter';

export async function fetchUserGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await apiClient.iterateUserGroups(async (userGroup) => {
    const userGroupEntity = createUserGroupEntity(userGroup);

    await jobState.addEntity(userGroupEntity);
  });
}

export async function buildAccountAndUserGroupRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await jobState.iterateEntities(
    { _type: Entities.USER_GROUP._type },
    async (userGroupEntity) => {
      if (userGroupEntity.name === accountEntity.name) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: accountEntity,
            to: userGroupEntity,
          }),
        );
      }
    },
  );
}

export const userGroupsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USER_GROUPS,
    name: 'Fetch User Groups',
    entities: [Entities.USER_GROUP],
    relationships: [],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchUserGroups,
  },
  {
    id: Steps.BUILD_ACCOUNT_USER_GROUP_RELATIONSHIPS,
    name: 'Build Account and User Group Relationships',
    entities: [],
    relationships: [Relationships.ACCOUNT_HAS_USER_GROUP],
    dependsOn: [Steps.ACCOUNT, Steps.USER_GROUPS],
    executionHandler: buildAccountAndUserGroupRelationship,
  },
];
