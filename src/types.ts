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
};

export type CircleCIUser = {
  id: string;
  name: string;
  login: string;
};
