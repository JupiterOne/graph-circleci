import { IntegrationProviderAPIError } from '@jupiterone/integration-sdk-core';
import { Response } from 'node-fetch';

export class RetryableError extends Error {
  retryable = true;
}

export function retryableRequestError(response: Response): RetryableError {
  return new RetryableError(
    `Encountered retryable response from provider (status=${response.status})`,
  );
}

export function fatalRequestError(response: Response): Error {
  return new IntegrationProviderAPIError({
    statusText: `Encountered fatal response from provider (status=${response.status})`,
    endpoint: response.url,
    status: response.status,
    fatal: true,
  });
}
