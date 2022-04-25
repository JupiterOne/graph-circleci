import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';

import { invocationConfig } from '../src';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_LOGIN = 'kjb-test';
const DEFAULT_USER_ID = 'DUMMY_ID';
const DEFAULT_API_KEY = 'DUMMY_API_KEY';

export const integrationConfig: IntegrationConfig = {
  apiKey: process.env.API_KEY || DEFAULT_API_KEY,
  login: process.env.LOGIN || DEFAULT_LOGIN,
  userId: process.env.USER_ID || DEFAULT_USER_ID,
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
