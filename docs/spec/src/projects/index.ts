import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const projectSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://circleci.com/api/v2/pipeline?org-slug={organization_slug}
     * PATTERN: Fetch Entities
     */
    id: 'fetch-projects',
    name: 'Fetch Projects',
    entities: [
      {
        resourceName: 'Project',
        _type: 'circleci_project',
        _class: ['Repository'],
      },
    ],
    relationships: [
      {
        _type: 'circleci_project_has_pipeline',
        sourceType: 'circleci_project',
        _class: RelationshipClass.HAS,
        targetType: 'circleci_pipeline',
      },
    ],
    dependsOn: ['fetch-pipelines', 'fetch-user-groups'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT:https://circleci.com/api/v2/pipeline?org-slug={organization_slug}
     * PATTERN: Fetch Relationships
     */
    id: 'build-project-and-pipelines-relationships',
    name: 'Build Project and Pipelines Relationships',
    entities: [],
    relationships: [
      {
        _type: 'circleci_project_has_pipelines',
        sourceType: 'circleci_project',
        _class: RelationshipClass.HAS,
        targetType: 'circleci_pipelines',
      },
    ],
    dependsOn: ['fetch-user-groups', 'fetch-pipelines', 'fetch-projects'],
    implemented: true,
  },
];
