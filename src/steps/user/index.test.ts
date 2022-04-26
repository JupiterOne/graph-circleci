import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-user', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-user',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.USERS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-account-and-user-relationships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-account-and-user-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.BUILD_ACCOUNT_USER_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
