import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-projects', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-projects',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.PROJECTS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-project-and-pipelines-relationships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-project-and-pipelines-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.BUILD_USER_GROUPS_PROJECTS_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
