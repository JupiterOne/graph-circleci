import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test(Steps.WORKFLOW_JOBS, async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: Steps.WORKFLOW_JOBS,
  });

  const stepConfig = buildStepTestConfigForStep(Steps.WORKFLOW_JOBS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
