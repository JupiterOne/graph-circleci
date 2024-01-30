import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  IntegrationWarnEventName,
  getRawData,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Steps } from '../constants';
import { createPipelineEntity, getPipelineKey } from './converter';
import { CircleCIUserGroup } from '../../types';

export async function fetchPipelines({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);

  const inaccessibleOrganizations: string[] = [];

  await jobState.iterateEntities(
    { _type: Entities.USER_GROUP._type },
    async (userGroupEntity) => {
      if (userGroupEntity.slug) {
        try {
          await apiClient.iteratePipelines(
            userGroupEntity.slug.toString(),
            async (pipeline) => {
              // We have seen instances where the API response has the same Pipeline
              // more than once.  Documentation confirms the pipeline ID is a UUID,
              // so we can safely treat these as duplicates and skip adding them.
              const pipelineKey = getPipelineKey(pipeline.id);
              if (!jobState.hasKey(pipelineKey)) {
                const pipelineEntity = createPipelineEntity(pipeline);
                await jobState.addEntity(pipelineEntity);
              } else {
                logger.info(
                  { pipelineKey },
                  `Encountered a duplicate pipeline key.  Skipping.`,
                );
              }
            },
          );
        } catch (e) {
          if (e.code === 404) {
            const userGroup = getRawData<CircleCIUserGroup>(userGroupEntity);

            inaccessibleOrganizations.push(userGroup?.slug as string);
          } else {
            throw e;
          }
        }
      }
    },
  );

  if (inaccessibleOrganizations.length > 0) {
    logger.publishWarnEvent({
      name: IntegrationWarnEventName.MissingPermission,
      description: `Could not fetch pipelines from the following using the following org slugs: ${inaccessibleOrganizations.join(
        ', ',
      )}). Please make sure to use personal API tokens with the right access permissions.`,
    });
  }
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
