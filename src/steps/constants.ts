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
  PIPELINE_WORKFLOWS: 'fetch-pipeline-workflows',
  WORKFLOW_JOBS: 'fetch-workflow-jobs',
  PROJECTS: 'fetch-projects',
  PROJECTS_ENV_VARIABLES: 'fetch-projects-env-variables',
  CONTEXTS: 'fetch-contexts',
  BUILD_USER_GROUPS_PROJECTS_RELATIONSHIPS:
    'build-project-and-pipelines-relationships',
  USERS: 'fetch-users',
  BUILD_ACCOUNT_USER_RELATIONSHIPS: 'build-account-and-user-relationships',
  BUILD_ACCOUNT_USER_GROUP_RELATIONSHIPS:
    'build-account-and-user-group-relationships',
};

export const Entities: Record<
  | 'ACCOUNT'
  | 'USER_GROUP'
  | 'PIPELINE'
  | 'PIPELINE_WORKFLOW'
  | 'WORKFLOW_JOB'
  | 'REPOSITORY'
  | 'REPOSITORY_ENV_VARIABLE'
  | 'CONTEXT'
  | 'CONTEXT_ENV_VARIABLE'
  | 'USER',
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
  PIPELINE_WORKFLOW: {
    resourceName: 'Pipeline Workflow',
    _type: 'circleci_workflow',
    _class: ['Configuration'],
  },
  WORKFLOW_JOB: {
    resourceName: 'Workflow Job',
    _type: 'circleci_job',
    _class: ['Task'],
  },
  REPOSITORY: {
    resourceName: 'Project',
    _type: 'circleci_project',
    _class: ['Repository'],
  },
  REPOSITORY_ENV_VARIABLE: {
    resourceName: 'Project Environment Variable',
    _type: 'circleci_project_environment_variable',
    _class: ['Configuration'],
  },
  CONTEXT: {
    resourceName: 'Context',
    _type: 'circleci_context',
    _class: ['Configuration'],
  },
  CONTEXT_ENV_VARIABLE: {
    resourceName: 'Context Environment Variable',
    _type: 'circleci_context_environment_variable',
    _class: ['Configuration'],
  },
  USER: {
    resourceName: 'User',
    _type: 'circleci_user',
    _class: ['User'],
  },
};

export const Relationships: Record<
  | 'PROJECT_HAS_PIPELINE'
  | 'PROJECT_HAS_ENV_VARIABLE'
  | 'PROJECT_USES_CONTEXT_ENV_VARIABLE'
  | 'CONTEXT_HAS_CONTEXT_ENV_VARIABLE'
  | 'PIPELINE_HAS_WORKFLOW'
  | 'WORKFLOW_HAS_JOB'
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
  PROJECT_HAS_ENV_VARIABLE: {
    _type: 'circleci_project_has_environment_variable',
    sourceType: Entities.REPOSITORY._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.REPOSITORY_ENV_VARIABLE._type,
  },
  PROJECT_USES_CONTEXT_ENV_VARIABLE: {
    _type: 'circleci_project_uses_context_environment_variable',
    sourceType: Entities.REPOSITORY._type,
    _class: RelationshipClass.USES,
    targetType: Entities.CONTEXT_ENV_VARIABLE._type,
  },
  CONTEXT_HAS_CONTEXT_ENV_VARIABLE: {
    _type: 'circleci_context_has_environment_variable',
    sourceType: Entities.CONTEXT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.CONTEXT_ENV_VARIABLE._type,
  },
  PIPELINE_HAS_WORKFLOW: {
    _type: 'circleci_pipeline_has_workflow',
    sourceType: Entities.PIPELINE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.PIPELINE_WORKFLOW._type,
  },
  WORKFLOW_HAS_JOB: {
    _type: 'circleci_workflow_has_job',
    sourceType: Entities.PIPELINE_WORKFLOW._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.WORKFLOW_JOB._type,
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
