type ModelSource = {
  repoId: string;
  filename: string;
};

export type ModelName = "Default" | "Disney" | "Cyberpunk" | "Anime";

export const parentModels = new Map<ModelName, ModelSource>([
  [
    "Default",
    {
      repoId: "runwayml/stable-diffusion-v1-5",
      filename: "v1-5-pruned-emaonly.ckpt",
    },
  ],
  [
    "Disney",
    { repoId: "nitrosocke/mo-di-diffusion", filename: "moDi-v1-pruned.ckpt" },
  ],
  [
    "Cyberpunk",
    {
      repoId: "DGSpitzer/Cyberpunk-Anime-Diffusion",
      filename: "Cyberpunk-Anime-Diffusion.ckpt",
    },
  ],
]);

export const parentModelNames = ["Default", "Disney", "Cyberpunk"] as const;

export const defaultModel: ModelName = "Default";

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
