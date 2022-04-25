import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Steps } from '../constants';
import { createPipelineEntity } from './converter';

export async function fetchPipelines({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.USER_GROUP._type },
    async (userGroupEntity) => {
      if (userGroupEntity.slug) {
        await apiClient.iteratePipelines(
          userGroupEntity.slug.toString(),
          async (pipeline) => {
            const pipelineEntity = createPipelineEntity(pipeline);
            await jobState.addEntity(pipelineEntity);
          },
        );
      }
    },
  );
}

export const pipelinesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.PIPELINES,
    name: 'Fetch Pipelines',
    entities: [Entities.PIPELINE],
    relationships: [],
    dependsOn: [Steps.USER_GROUPS],
    executionHandler: fetchPipelines,
  },
];
