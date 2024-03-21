import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { CircleCIWorkflowJob } from '../../types';

export function getWorkflowJobKey(id: string): string {
  return `${Entities.WORKFLOW_JOB._type}:${id}`;
}

export function createWorkflowJobEntity(
  workflowJob: CircleCIWorkflowJob,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: workflowJob,
      assign: {
        _type: Entities.WORKFLOW_JOB._type,
        _class: Entities.WORKFLOW_JOB._class,
        _key: getWorkflowJobKey(workflowJob.id),
        id: workflowJob.id,
        name: workflowJob.name,
        canceledBy: workflowJob.canceled_by,
        jobNumber: workflowJob.job_number,
        approvedBy: workflowJob.approved_by,
        projectSlug: workflowJob.project_slug,
        status: workflowJob.status,
        type: workflowJob.type,
        approvalRequestId: workflowJob.approval_request_id,
        startedOn: parseTimePropertyValue(workflowJob.started_at),
        stoppedOn: parseTimePropertyValue(workflowJob.stopped_at),
      },
    },
  });
}
