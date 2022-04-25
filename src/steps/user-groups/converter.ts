import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { CircleCIUserGroup } from '../../types';

export function getUserGroupKey(id: string): string {
  return `circleci_user_group:${id}`;
}

export function createUserGroupEntity(userGroup: CircleCIUserGroup): Entity {
  return createIntegrationEntity({
    entityData: {
      source: userGroup,
      assign: {
        _type: Entities.USER_GROUP._type,
        _class: Entities.USER_GROUP._class,
        _key: getUserGroupKey(userGroup.id),
        id: userGroup.id,
        name: userGroup.name,
        slug: userGroup.slug,
        vcstype: userGroup.vcs_type,
      },
    },
  });
}
