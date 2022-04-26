import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function getAccountKey(login: string): string {
  return `circleci_account:${login}`;
}

export function createAccountEntity(account: {
  login: string;
  id: string;
}): Entity {
  return createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        _key: getAccountKey(account.id),
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        name: account.login,
      },
    },
  });
}
