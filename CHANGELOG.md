# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 1.0.21 2024-02-09

- Fix pipelines pagination

## 1.0.21 2024-02-06

- Use pmap

## 1.0.20 2024-02-05

- Fix pipelines iteration

## 1.0.19 2024-01-31

- Update error

## 1.0.16 2024-01-30

- Add fetch pipelines permission warning.

## 1.0.15 2024-01-24

- Added check to rety when there's an ECONNRESET error occur

## 1.0.14 2024-01-23

- Adjusted Retry logic to take into account limit time
- Better error handling and more logs to troubleshoot

## 1.0.11 2024-01-22

- Changed to re-try for all errors even for connection errors

## 1.0.6 2024-01-09

- Added logger to the Api Client

## 1.0.3 2024-01-05

- Fixed issue when the organization slug has a / in the name

## 1.0.2 2023-12-13

- Upgraded packages version
- Updated to use node 18.x

## 1.0.1 - 2023-06-12

### Fixed

- Catching duplicate pipeline entries being returned from the API.

## 1.0.0 - 2022-04-26

### Added

- Ingest new entities
  - `circleci_account`
  - `circleci_user`
  - `circleci_user_group`
  - `circleci_project`
  - `circleci_pipeline`
- Build new relationships
  - `circleci_account_has_user`
  - `circleci_account_has_user_group`
  - `circleci_user_group_has_user`
  - `circleci_user_group_has_project`
  - `circleci_project_has_pipeline`
