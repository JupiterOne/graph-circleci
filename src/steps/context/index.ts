import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  getRawData,
  IntegrationWarnEventName,
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { CircleCIContextRestriction, CircleCIUserGroup } from '../../types';
import { Entities, Relationships, Steps } from '../constants';
import {
  createContextEntity,
  createContextEnvVariableEntity,
} from './converter';
import { getProjectKey } from '../project/converter';

export async function fetchContexts({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);

  const inaccessibleOrganizations: string[] = [];

  await jobState.iterateEntities(
    { _type: Entities.USER_GROUP._type },
    async (userGroupEntity) => {
      if (userGroupEntity.slug) {
        try {
          await apiClient.iterateContexts(
            userGroupEntity.slug.toString(),
            async (context) => {
              const contextEntity = createContextEntity(context);

              // Create context entity
              if (!jobState.hasKey(contextEntity._key)) {
                await jobState.addEntity(contextEntity);
              }

              // Fetch context restrictions
              const restrictedProjectsRules: CircleCIContextRestriction[] = [];

              await apiClient.iterateContextRestrictions(
                context.id,
                (restriction) => {
                  if (restriction.restriction_type === 'project') {
                    restrictedProjectsRules.push(restriction);
                  }
                },
              );

              // Fetch context env variables
              await apiClient.iterateContextEnvVariables(
                context.id,
                async (contextEnvVariable) => {
                  const contextEnvVariableEntity =
                    createContextEnvVariableEntity(contextEnvVariable);

                  if (!jobState.hasKey(contextEnvVariableEntity._key)) {
                    await jobState.addEntity(contextEnvVariableEntity);
                  }

                  // Create context -> HAS -> context env variable
                  const contextContextEnvVariableRelationship =
                    createDirectRelationship({
                      _class: RelationshipClass.HAS,
                      from: contextEntity,
                      to: contextEnvVariableEntity,
                    });

                  if (
                    !jobState.hasKey(contextContextEnvVariableRelationship._key)
                  ) {
                    await jobState.addRelationship(
                      contextContextEnvVariableRelationship,
                    );
                  }

                  // Create project -> USES -> context env variable
                  if (restrictedProjectsRules.length) {
                    for (const restrictedProjectsRule of restrictedProjectsRules) {
                      const projectKey = getProjectKey(
                        restrictedProjectsRule.project_id,
                      );

                      if (jobState.hasKey(projectKey)) {
                        await jobState.addRelationship(
                          createDirectRelationship({
                            _class: RelationshipClass.USES,
                            fromKey: projectKey,
                            fromType: Entities.REPOSITORY._type,
                            toKey: contextEnvVariableEntity._key,
                            toType: contextEnvVariableEntity._type,
                          }),
                        );
                      }
                    }
                  }
                },
              );
            },
          );
        } catch (e) {
          if (e.status === 404) {
            const userGroup = getRawData<CircleCIUserGroup>(userGroupEntity);

            inaccessibleOrganizations.push(userGroup?.slug as string);
          } else {
            throw e;
          }
        }
      }
    },
  );

  if (inaccessibleOrganizations.length > 0) {
    logger.publishWarnEvent({
      name: IntegrationWarnEventName.MissingPermission,
      description: `Could not fetch pipelines from the following using the following org slugs: ${inaccessibleOrganizations.join(
        ', ',
      )}). Please make sure to use personal API tokens with the right access permissions.`,
    });
  }
}

export const contextsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.CONTEXTS,
    name: 'Fetch Contexts',
    entities: [Entities.CONTEXT, Entities.CONTEXT_ENV_VARIABLE],
    relationships: [
      Relationships.PROJECT_USES_CONTEXT_ENV_VARIABLE,
      Relationships.CONTEXT_HAS_CONTEXT_ENV_VARIABLE,
    ],
    dependsOn: [Steps.USER_GROUPS, Steps.PROJECTS],
    executionHandler: fetchContexts,
  },
];
