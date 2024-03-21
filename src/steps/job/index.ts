import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
  getRawData,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { createWorkflowJobEntity } from './converter';
import { CircleCIPipelineWorkflow } from '../../types';

export async function fetchWorkflowJobs({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);

  await jobState.iterateEntities(
    { _type: Entities.PIPELINE_WORKFLOW._type },
    async (workflowEntity) => {
      const workflowEntityRaw =
        getRawData<CircleCIPipelineWorkflow>(workflowEntity);

      if (!workflowEntityRaw?.id) return;

      await apiClient.iterateWorkflowJobs(
        workflowEntityRaw?.id,
        async (pipelineWorkflowJob) => {
          const jobEntity = createWorkflowJobEntity(pipelineWorkflowJob);

          if (!jobState.hasKey(jobEntity._key)) {
            await jobState.addEntity(jobEntity);
          }

          // Create workflow -> HAS -> job relationship
          const workflowJobRelationship = createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: workflowEntity,
            to: jobEntity,
          });

          if (!jobState.hasKey(workflowJobRelationship._key)) {
            await jobState.addRelationship(workflowJobRelationship);
          }
        },
      );
    },
  );
}

export const jobsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.WORKFLOW_JOBS,
    name: 'Fetch Workflow Jobs',
    entities: [Entities.WORKFLOW_JOB],
    relationships: [Relationships.WORKFLOW_HAS_JOB],
    dependsOn: [Steps.PIPELINE_WORKFLOWS],
    executionHandler: fetchWorkflowJobs,
  },
];
