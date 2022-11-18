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
        file_name: string;
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

export interface GetDeciptionResponse {
  id: string;
  name: string;
  owner_id: string;
  style_slug: string;
  regularization: GenerateRegularization | FetchRegularization;
  subject: {
    slug: string;
    subject_photos: string[];
  };
  style: {
    repo_id: string;
    filename: string;
  };
}
