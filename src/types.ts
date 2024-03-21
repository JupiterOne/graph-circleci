export type CircleCIUserGroup = {
  id: string;
  name: string;
  slug: string;
  vcs_type: string;
};

export type CircleCIPipeline = {
  id: string;
  name: string;
  project_slug: string;
  state: string;
  created_at: string;
  updated_at: string;
};

export type CircleCIPipelineWorkflow = {
  pipeline_id: string;
  canceled_by: string;
  id: string;
  name: string;
  project_slug: string;
  errored_by: string;
  tag: string;
  status: string;
  started_by: string;
  pipeline_number: string;
  created_at: string;
  stopped_at: string;
};

export type CircleCIWorkflowJob = {
  canceled_by: string;
  job_number: number;
  id: string;
  started_at: string;
  name: string;
  approved_by: string;
  project_slug: string;
  status: string;
  type: string;
  stopped_at: string;
  approval_request_id: string;
};

export type CircleCIWorkflow = {
  id: string;
  name: string;
  project_slug: string;
  pipeline_number: number;
};

export type CircleCIProject = {
  organization_id: string;
  id: string;
  name: string;
  organization_name: string;
  slug: string;
};

export type CircleCIUser = {
  id: string;
  name: string;
  login: string;
};

export type CircleCIProjectEnvVariable = {
  name: string;
  value: string;
  created_at: string;
};

export type CircleCIContext = {
  id: string;
  name: string;
  created_at: string;
};

export type CircleCIContextRestriction = {
  context_id: string;
  id: string;
  project_id: string;
  name: string;
  restriction_type: string;
  restriction_value: string;
};

export type CircleCIContextEnvVariable = {
  variable: string;
  created_at: string;
  updated_at: string;
  context_id: string;
};
