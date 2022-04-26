import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { CircleCIProject } from '../../types';

export function getProjectKey(id: string): string {
  return `circleci_project:${id}`;
}

export function createProjectEntity(project: CircleCIProject): Entity {
  return createIntegrationEntity({
    entityData: {
      source: project,
      assign: {
        _type: Entities.REPOSITORY._type,
        _class: Entities.REPOSITORY._class,
        _key: getProjectKey(project.id),
        id: project.id,
        name: project.name,
        organizationName: project.organization_name,
        organizationId: project.organization_id,
      },
    },
  });
}
