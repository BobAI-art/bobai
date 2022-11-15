type ModelSource = {
  repoId: string;
  filename: string;
};


export type ModelClass =
  | "person_ddim"
  | "man_euler"
  | "man_unsplash"
  | "woman_ddim"
  | "blonde_woman";

export const modelClasses = new Map<ModelClass, string>([
  ["person_ddim", "person"],
  ["man_euler", "man"],
  ["woman_ddim", "woman"],
  ["blonde_woman", "blonde woman"],
]);

export const defaultModelClass: ModelClass = "person_ddim";
