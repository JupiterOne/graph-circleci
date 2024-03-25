import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test(Steps.PROJECTS, async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: Steps.PROJECTS,
  });

  const stepConfig = buildStepTestConfigForStep(Steps.PROJECTS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test(Steps.PROJECTS_ENV_VARIABLES, async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: Steps.PROJECTS_ENV_VARIABLES,
  });

  const stepConfig = buildStepTestConfigForStep(Steps.PROJECTS_ENV_VARIABLES);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test(Steps.BUILD_USER_GROUPS_PROJECTS_RELATIONSHIPS, async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: Steps.BUILD_USER_GROUPS_PROJECTS_RELATIONSHIPS,
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.BUILD_USER_GROUPS_PROJECTS_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
