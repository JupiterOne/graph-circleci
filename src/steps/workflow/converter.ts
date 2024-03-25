import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { CircleCIPipelineWorkflow } from '../../types';

export function getPipelineWorkflowKey(id: string): string {
  return `${Entities.PIPELINE_WORKFLOW._type}:${id}`;
}

export function createPipelineWorkflowEntity(
  pipelineWorkflow: CircleCIPipelineWorkflow,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: pipelineWorkflow,
      assign: {
        _type: Entities.PIPELINE_WORKFLOW._type,
        _class: Entities.PIPELINE_WORKFLOW._class,
        _key: getPipelineWorkflowKey(pipelineWorkflow.id),
        id: pipelineWorkflow.id,
        name: pipelineWorkflow.name,
        pipelineId: pipelineWorkflow.pipeline_id,
        canceledBy: pipelineWorkflow.canceled_by,
        projectSlug: pipelineWorkflow.project_slug,
        erroredBy: pipelineWorkflow.errored_by,
        tag: pipelineWorkflow.tag,
        status: pipelineWorkflow.status,
        startedBy: pipelineWorkflow.started_by,
        pipelineNumber: pipelineWorkflow.pipeline_number,
        createdOn: parseTimePropertyValue(pipelineWorkflow.created_at),
        stoppedOn: parseTimePropertyValue(pipelineWorkflow.stopped_at),
      },
    },
  });
}
