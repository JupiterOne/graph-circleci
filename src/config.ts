import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  userId: {
    type: 'string',
  },
  login: {
    type: 'string',
  },
  apiKey: {
    type: 'string',
    mask: true,
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  userId: string;
  login: string;
  apiKey: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;
  config.apiKey =
    'CCIPAT_VrqbWT8himLLKAJcCadufw_e07ed51927127b1d579263f08455301c368434c8';
  config.login = 'civan';
  config.userId = 'carlos.mercado@contractor.jupiterone.com';

  if (!config.apiKey || !config.login || !config.userId) {
    throw new IntegrationValidationError(
      'Config requires  {apiKey, login, userId}',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
