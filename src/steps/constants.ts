import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USER_GROUPS: 'fetch-user-groups',
  PIPELINES: 'fetch-pipelines',
  PROJECTS: 'fetch-projects',
  BUILD_USER_GROUPS_PROJECTS_RELATIONSHIPS:
    'build-project-and-pipelines-relationships',
  USERS: 'fetch-users',
  BUILD_ACCOUNT_USER_RELATIONSHIPS: 'build-account-and-user-relationships',
  BUILD_ACCOUNT_USER_GROUP_RELATIONSHIPS:
    'build-account-and-user-group-relationships',
};

export const Entities: Record<
  'ACCOUNT' | 'USER_GROUP' | 'PIPELINE' | 'REPOSITORY' | 'USER',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'circleci_account',
    _class: ['Account'],
  },
  USER_GROUP: {
    resourceName: 'UserGroup',
    _type: 'circleci_user_group',
    _class: ['Group'],
  },
  PIPELINE: {
    resourceName: 'Pipeline',
    _type: 'circleci_pipeline',
    _class: ['Configuration'],
  },
  REPOSITORY: {
    resourceName: 'Project',
    _type: 'circleci_project',
    _class: ['Repository'],
  },
  USER: {
    resourceName: 'User',
    _type: 'circleci_user',
    _class: ['User'],
  },
};

export const Relationships: Record<
  | 'PROJECT_HAS_PIPELINE'
  | 'USER_GROUP_HAS_PROJECT'
  | 'USER_GROUP_HAS_USER'
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_USER_GROUP',
  StepRelationshipMetadata
> = {
  PROJECT_HAS_PIPELINE: {
    _type: 'circleci_project_has_pipeline',
    sourceType: Entities.REPOSITORY._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.PIPELINE._type,
  },
  USER_GROUP_HAS_PROJECT: {
    _type: 'circleci_user_group_has_project',
    sourceType: Entities.USER_GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.REPOSITORY._type,
  },
  USER_GROUP_HAS_USER: {
    _type: 'circleci_user_group_has_user',
    sourceType: Entities.USER_GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_USER: {
    _type: 'circleci_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_USER_GROUP: {
    _type: 'circleci_account_has_user_group',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER_GROUP._type,
  },
};
