# Development

This integration focuses on [CircleCI](https://www.circleci.com/) and is using
[CircleCI API](https://circleci.com/api/v2/) for interacting with the CircleCI
resources.

## Provider account setup

1. Sign-up for a CircleCI account.
2. Link a VCS provider (Github/Bitbucket).
3. Take note of the provided domain.
4. In the dashboard, go to User Settings > Personal API Tokens.
5. Generate an API token.

## Authentication

Provide the `API_KEY`, `LOGIN` (github/bitbucket username), and the user
`USER_ID` (obtained from User Settings) to the `.env`. You can use
[`.env.example`](../.env.example) as a reference.

The API Key will be used to authorize requests using Basic Authorization.
