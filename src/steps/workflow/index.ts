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
import { createPipelineWorkflowEntity } from './converter';
import { CircleCIPipeline } from '../../types';

export async function fetchPipelineWorkflows({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);

  await jobState.iterateEntities(
    { _type: Entities.PIPELINE._type },
    async (pipelineEntity) => {
      const pipelineEntityRaw = getRawData<CircleCIPipeline>(pipelineEntity);

      if (!pipelineEntityRaw?.id) return;

      await apiClient.iteratePipelinesWorkflows(
        pipelineEntityRaw?.id,
        async (pipelineWorkflow) => {
          const workflowEntity = createPipelineWorkflowEntity(pipelineWorkflow);

          if (!jobState.hasKey(workflowEntity._key)) {
            await jobState.addEntity(
              createPipelineWorkflowEntity(pipelineWorkflow),
            );
          }

          // Create pipeline -> HAS -> workflow relationship
          const pipelineWorkflowRelationship = createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: pipelineEntity,
            to: workflowEntity,
          });

          if (!jobState.hasKey(pipelineWorkflowRelationship._key)) {
            await jobState.addRelationship(pipelineWorkflowRelationship);
          }
        },
      );
    },
  );
}

export const workflowsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.PIPELINE_WORKFLOWS,
    name: 'Fetch Pipeline Workflows',
    entities: [Entities.PIPELINE_WORKFLOW],
    relationships: [Relationships.PIPELINE_HAS_WORKFLOW],
    dependsOn: [Steps.PIPELINES],
    executionHandler: fetchPipelineWorkflows,
  },
];
