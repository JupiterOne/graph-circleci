import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const pipelineSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://circleci.com/api/v2/pipeline?org-slug={organization_slug}
     * PATTERN: Fetch  Child Entities
     */
    id: 'fetch-pipelines',
    name: 'Fetch Pipelines',
    entities: [
      {
        resourceName: 'Pipelines',
        _type: 'circleci_pipelines',
        _class: ['Configuration'],
      },
    ],
    relationships: [],
    dependsOn: ['fetch-account', 'fetch-user-groups'],
    implemented: true,
  },
];
