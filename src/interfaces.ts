export interface GenerateRegularization {
  type: "generate";
  prompt: string;
  count: number;
}

export interface FetchRegularization {
  type: "fetch";
  source: string;
  prompt: string;
}

export interface GetPhotosResponse {
  source:
    | {
        source: "huggingface";
        repo_id: string;
        filename: string;
      }
    | {
        source: "aws";
        path: string;
      };
  photos: {
    id: string;
    prompt: string;
  }[];
}

export interface GetModelResponse {
  id: string;
  name: string;
  owner_id: string;
  parent_model_code: string;
  regularization: GenerateRegularization | FetchRegularization;
  subject: {
    slug: string;
    subject_photos: string[];
  };
  parent_model: {
    repo_id: string;
    filename: string;
  };
}
