import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { CircleCIContext, CircleCIContextEnvVariable } from '../../types';

export function getContextKey(id: string): string {
  return `${Entities.CONTEXT._type}:${id}`;
}

export function getContextEnvVariableKey(variable: string): string {
  return `${Entities.CONTEXT_ENV_VARIABLE._type}:${variable}`;
}

export function createContextEntity(context: CircleCIContext): Entity {
  return createIntegrationEntity({
    entityData: {
      source: context,
      assign: {
        _type: Entities.CONTEXT._type,
        _class: Entities.CONTEXT._class,
        _key: getContextKey(context.id),
        id: context.id,
        name: context.name,
        createdOn: parseTimePropertyValue(context.created_at),
      },
    },
  });
}

export function createContextEnvVariableEntity(
  contextEnvVariable: CircleCIContextEnvVariable,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: contextEnvVariable,
      assign: {
        _type: Entities.CONTEXT_ENV_VARIABLE._type,
        _class: Entities.CONTEXT_ENV_VARIABLE._class,
        _key: getContextEnvVariableKey(contextEnvVariable.variable),
        name: contextEnvVariable.variable,
        variable: contextEnvVariable.variable,
        contextId: contextEnvVariable.context_id,
        createdOn: parseTimePropertyValue(contextEnvVariable.created_at),
        updatedOn: parseTimePropertyValue(contextEnvVariable.updated_at),
      },
    },
  });
}
