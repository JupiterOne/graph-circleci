import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-user-groups', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-user-groups',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.USER_GROUPS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-account-and-user-group-relationships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-account-and-user-group-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.BUILD_ACCOUNT_USER_GROUP_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
