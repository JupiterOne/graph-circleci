import fetch from 'node-fetch';
import {
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import pMap from 'p-map';

import { IntegrationConfig } from './config';
import {
  CircleCIPipeline,
  CircleCIProject,
  CircleCIUser,
  CircleCIUserGroup,
} from './types';

import { retry } from '@lifeomic/attempt';
import { fatalRequestError, retryableRequestError } from './error';

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
      const options = {
        method,
        headers: {
          'Circle-Token': this.config.apiKey,
        },
      };

      let retryDelay = 0;
      const response = await retry(
        async () => {
          const resp = await fetch(endpoint, options);
          retryDelay = 5000;

          if (resp.ok) {
            return resp;
          }

          if (isRetryableRequest(resp)) {
            const headers = resp.headers;
            const retryAfterHeader = Number(headers.get('retry-after'));
            const xRateLimitHeader = Number(headers.get('x-ratelimit-limit'));
            const rateLimitHeader = Number(headers.get('ratelimit-limit'));
            const serverRetryDelay =
              retryAfterHeader || xRateLimitHeader || rateLimitHeader;

            if (serverRetryDelay) {
              retryDelay = serverRetryDelay * 1000;
              this.logger?.warn(serverRetryDelay, 'Retry Delay');
            }

            this.logger?.warn(resp, 're-trying request from fetch');

            throw retryableRequestError(resp);
          } else {
            this.logger?.warn(resp, 'fatal request error, not retrying');
            throw fatalRequestError(resp);
          }
        },
        {
          calculateDelay: () => retryDelay,
          maxAttempts: 10,
          handleError: (err, context) => {
            this.logger?.warn(err, 'retry handle-error');
            if (err.code === 'ECONNRESET') {
              this.logger?.warn(err, 'Encountered ECONNRESET. Retrying.');
            } else if (!err.retryable) {
              context.abort();
            }
          },
        },
      );

      return response.json();
    } catch (err) {
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
      let nextPageToken: string | null = null;
      let hasNext = false;
      do {
        const response = await this.getRequest(nextPageToken || uri, method);

        await pMap(
          response.items,
          async (item) => {
            await iteratee(item as T);
          },
          { concurrency: 5 },
        );

        nextPageToken = response.next_page_token;
        if (nextPageToken) {
          nextPageToken = `${uri}&page-token=${response.next_page_token}`;
          hasNext = true;
        } else {
          hasNext = false;
        }
      } while (hasNext);
    } catch (err) {
      this.logger?.warn(err, 'Could not get Pipeline Paginated Request');
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: uri,
        status: err.status,
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
    await this.pipelinePaginatedRequest<CircleCIPipeline>(
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

/**
 * Function for determining if a request is retryable
 * based on the returned status.
 */
function isRetryableRequest({ status }: Response): boolean {
  // if no status code, assume it's retryable
  if (!status) return true;

  return (
    // 5xx error from provider (their fault, might be retryable)
    // 429 === too many requests, we got rate limited so safe to try again
    status >= 500 || status === 429
  );
}
