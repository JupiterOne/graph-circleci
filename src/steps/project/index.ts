import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  getRawData,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { CircleCIPipeline, CircleCIProject } from '../../types';
import { Entities, Relationships, Steps } from '../constants';
import { createProjectEntity, getProjectKey } from './converter';
import { getUserGroupKey } from '../user-groups/converter';

export async function fetchProjects({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.PIPELINE._type },
    async (pipelineEntity) => {
      const pipeline = getRawData<CircleCIPipeline>(pipelineEntity);
      if (!pipeline) {
        logger.warn(
          { _key: pipelineEntity._key },
          'Could not get raw data for pipeline entity',
        );
        return;
      }

      const project = await apiClient.fetchProjectDetails(
        pipeline.project_slug,
      );

      const foundProjectEntity = await jobState.findEntity(
        getProjectKey(project.id),
      );
      if (!foundProjectEntity) {
        const projectEntity = createProjectEntity(project);
        await jobState.addEntity(projectEntity);

        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: projectEntity,
            to: pipelineEntity,
          }),
        );
      } else {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: foundProjectEntity,
            to: pipelineEntity,
          }),
        );
      }
    },
  );
}

export async function buildUserGroupAndProjectRelationship({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.REPOSITORY._type },
    async (repositoryEntity) => {
      const repository = getRawData<CircleCIProject>(repositoryEntity);
      if (!repository) {
        logger.warn(
          { _key: repositoryEntity._key },
          'Could not get raw data for repository entity',
        );
        return;
      }

      const userGroupEntity = await jobState.findEntity(
        getUserGroupKey(repository.organization_id),
      );

      if (userGroupEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: userGroupEntity,
            to: repositoryEntity,
          }),
        );
      }
    },
  );
}

export const projectsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.PROJECTS,
    name: 'Fetch Projects',
    entities: [Entities.REPOSITORY],
    relationships: [Relationships.PROJECT_HAS_PIPELINE],
    dependsOn: [Steps.PIPELINES],
    executionHandler: fetchProjects,
  },
  {
    id: Steps.BUILD_USER_GROUPS_PROJECTS_RELATIONSHIPS,
    name: 'Build Project and Pipelines Relationships',
    entities: [],
    relationships: [Relationships.USER_GROUP_HAS_PROJECT],
    dependsOn: [Steps.USER_GROUPS, Steps.PROJECTS],
    executionHandler: buildUserGroupAndProjectRelationship,
  },
];
