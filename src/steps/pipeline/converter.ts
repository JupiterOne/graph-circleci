import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { CircleCIPipeline } from '../../types';

export function getPipelineKey(id: string): string {
  return `circleci_pipeline:${id}`;
}

export function createPipelineEntity(pipeline: CircleCIPipeline): Entity {
  return createIntegrationEntity({
    entityData: {
      source: pipeline,
      assign: {
        _type: Entities.PIPELINE._type,
        _class: Entities.PIPELINE._class,
        _key: getPipelineKey(pipeline.id),
        id: pipeline.id,
        slug: pipeline.project_slug,
        name: pipeline.id,
        state: pipeline.state,
        createdOn: parseTimePropertyValue(pipeline.created_at),
        updatedOn: parseTimePropertyValue(pipeline.updated_at),
      },
    },
  });
}
