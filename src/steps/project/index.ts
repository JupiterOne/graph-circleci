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
import {
  createProjectEntity,
  createProjectEnvVariableEntity,
  getProjectKey,
} from './converter';
import { getUserGroupKey } from '../user-groups/converter';

export async function fetchProjects({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);

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

export async function fetchProjectEnvVariables({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);

  await jobState.iterateEntities(
    { _type: Entities.REPOSITORY._type },
    async (projectEntity) => {
      const projectRaw = getRawData<CircleCIProject>(projectEntity);

      if (!projectRaw?.slug) return;

      await apiClient.iterateProjectEnvVariables(
        projectRaw?.slug,
        async (envVariable) => {
          const envVariableEntity = createProjectEnvVariableEntity(
            envVariable,
            projectRaw.id,
            projectRaw.slug,
          );

          if (!jobState.hasKey(envVariableEntity._key)) {
            await jobState.addEntity(envVariableEntity);
          }

          // Create project -> has -> env variable relationship
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: projectEntity,
              to: envVariableEntity,
            }),
          );
        },
      );
    },
  );
}

export async function buildUserGroupAndProjectRelationship({
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
    id: Steps.PROJECTS_ENV_VARIABLES,
    name: 'Fetch Project Environmnet Variables',
    entities: [Entities.REPOSITORY_ENV_VARIABLE],
    relationships: [Relationships.PROJECT_HAS_ENV_VARIABLE],
    dependsOn: [Steps.PROJECTS],
    executionHandler: fetchProjectEnvVariables,
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
