import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
// import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

async function run() {
  const stepConfig = buildStepTestConfigForStep(Steps.PIPELINES);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
}
run();
