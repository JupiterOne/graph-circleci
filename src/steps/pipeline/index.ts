import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Steps } from '../constants';
import { createPipelineEntity, getPipelineKey } from './converter';

export async function fetchPipelines({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.USER_GROUP._type },
    async (userGroupEntity) => {
      if (userGroupEntity.slug) {
        await apiClient.iteratePipelines(
          userGroupEntity.slug.toString(),
          async (pipeline) => {
            // We have seen instances where the API response has the same Pipeline
            // more than once.  Documentation confirms the pipeline ID is a UUID,
            // so we can safely treat these as duplicates and skip adding them.
            if (!jobState.hasKey(getPipelineKey(pipeline.id))) {
              const pipelineEntity = createPipelineEntity(pipeline);
              await jobState.addEntity(pipelineEntity);
            } else {
              logger.info(
                { pipeline },
                `Encountered a duplicate pipeline key.  Skipping.`,
              );
            }
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
