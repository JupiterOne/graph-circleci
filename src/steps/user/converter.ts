import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { CircleCIUser } from '../../types';

export function getUserKey(id: string): string {
  return `circleci_user:${id}`;
}

export function createUserEntity(user: CircleCIUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: getUserKey(user.id),
        id: user.id,
        name: user.login,
        username: user.login,
        active: true,
      },
    },
  });
}
