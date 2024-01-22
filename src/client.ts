import fetch from 'node-fetch';
import {
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  CircleCIPipeline,
  CircleCIProject,
  CircleCIUser,
  CircleCIUserGroup,
} from './types';

import { retry } from '@lifeomic/attempt';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export class APIClient {
  constructor(
    readonly config: IntegrationConfig,
    readonly logger?: IntegrationLogger,
  ) {}

  private baseUri = `https://circleci.com/api/v2/`;
  private withBaseUri = (path: string) => `${this.baseUri}${path}`;

  private async getRequest<T>(
    endpoint: string,
    method: 'GET' | 'HEAD' = 'GET',
  ): Promise<T> {
    try {
      this.config.apiKey =
        'CCIPAT_VrqbWT8himLLKAJcCadufw_e07ed51927127b1d579263f08455301c368434c8';
      this.config.login = 'civan';
      this.config.userId = 'carlos.mercado@contractor.jupiterone.com';
      const options = {
        method,
        headers: {
          'Circle-Token': this.config.apiKey,
        },
      };
      const response = await retry(async () => await fetch(endpoint, options), {
        delay: 5000,
        maxAttempts: 10,
        handleError: (err, context) => {
          this.logger?.warn(err, 're-trying request');
          // if (
          //   err.statusCode !== 429 ||
          //   ([500, 502, 503].includes(err.statusCode) && context.attemptNum > 1)
          // ) {
          //   context.abort();
          // }
        },
      });

      const resp = await response.json();
      // console.log(resp);

      return resp;
      // return response.json();
    } catch (err) {
      console.log('getRequest error;');
      console.log(err);
      this.logger?.warn(err, 'Could not get Request on API Client');
      throw new IntegrationProviderAPIError({
        endpoint: endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  private async pipelinePaginatedRequest<T>(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
    iteratee: ResourceIteratee<T>,
  ): Promise<void> {
    try {
      let next: string | null = null;
      let counter = 0;
      do {
        console.log(counter);
        const response = await this.getRequest(next || uri, method);

        for (const item of response.items) {
          await iteratee(item);
        }

        next = response.next_page_token;
        if (next) {
          next = `${uri}&page_token=${response.next_page_token}`;
        }
        counter++;
      } while (next || counter <= 10000);
    } catch (err) {
      console.log('pipelinePaginatedRequest error');
      console.log(err);
      this.logger?.warn(err, 'Could not get Pipeline Paginated Request');
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: uri,
        status: err.statusCode,
        statusText: err.message,
      });
    }
  }

  public async verifyAuthentication(): Promise<void> {
    const uri = this.withBaseUri('me/');
    try {
      await this.getRequest(uri);
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iteratePipelines(
    organization: string,
    iteratee: ResourceIteratee<CircleCIPipeline>,
  ): Promise<void> {
    organization = encodeURIComponent(organization);
    await this.pipelinePaginatedRequest(
      this.withBaseUri(`pipeline?org-slug=${organization}`),
      'GET',
      iteratee,
    );
  }

  public async iterateUserGroups(
    iteratee: ResourceIteratee<CircleCIUserGroup>,
  ): Promise<void> {
    const userGroups: CircleCIUserGroup[] = await this.getRequest(
      this.withBaseUri(`me/collaborations`),
    );

    for (const item of userGroups) {
      await iteratee(item);
    }
  }

  public async fetchUser(): Promise<CircleCIUser> {
    return this.getRequest(this.withBaseUri(`me`));
  }

  public async fetchPipelineDetails(id: string): Promise<CircleCIPipeline> {
    return this.getRequest(this.withBaseUri(`pipeline/${id}`));
  }

  public async fetchProjectDetails(
    project_slug: string,
  ): Promise<CircleCIProject> {
    return this.getRequest(this.withBaseUri(`project/${project_slug}`));
  }

  public async fetchUserDetail(): Promise<CircleCIUser> {
    return this.getRequest(this.withBaseUri(`me`));
  }
}

export function createAPIClient(
  config: IntegrationConfig,
  logger?: IntegrationLogger,
): APIClient {
  return new APIClient(config, logger);
}
