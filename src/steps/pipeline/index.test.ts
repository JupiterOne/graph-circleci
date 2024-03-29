import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test(Steps.PIPELINES, async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: Steps.PIPELINES,
  });

  const stepConfig = buildStepTestConfigForStep(Steps.PIPELINES);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
