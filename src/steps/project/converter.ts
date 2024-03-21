import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { CircleCIProject, CircleCIProjectEnvVariable } from '../../types';

export function getProjectKey(id: string): string {
  return `${Entities.REPOSITORY._type}:${id}`;
}

export function getProjectEnvVariableKey(name: string): string {
  return `${Entities.REPOSITORY_ENV_VARIABLE._type}:${name}`;
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

export function createProjectEnvVariableEntity(
  envVariable: CircleCIProjectEnvVariable,
  projectId: string,
  projectSlug: string,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        ...envVariable,
        value: '[REDACTED]', // Please be careful with with this. Might include secrets
      },
      assign: {
        _type: Entities.REPOSITORY_ENV_VARIABLE._type,
        _class: Entities.REPOSITORY_ENV_VARIABLE._class,
        _key: getProjectEnvVariableKey(envVariable.name),
        name: envVariable.name,
        createdOn: parseTimePropertyValue(envVariable.created_at),
        projectId,
        projectSlug,
      },
    },
  });
}
