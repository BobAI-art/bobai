import { NextPage } from "next";
import { Layout } from "../../../../components/Layout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "../../../../utils/trpc";
import { photoUrl } from "../../../../utils/helpers";
import Button from "../../../../components/Button";
import React  from "react";
import { defaultModel, defaultModelClass, ModelName, parentModels } from "../../../../utils/consts";
import { ModelClassSelect } from "../../../../components/ModelClassSelect";
import { modelCreateSchema } from "../../../../utils/schema";
import toast from "react-hot-toast";

const ModelNew: NextPage = () => {
  const [modelClass, setModelClass] = React.useState<string>(defaultModelClass);
  const [name, setName] = React.useState<string>("");
  const router = useRouter();
  const parentModelRef = React.useRef<HTMLSelectElement>(null);

  useSession({
    required: true,
  });
  const slug = router.query.slug as string;

  const subject = trpc.subject.get.useQuery(slug);
  const photos = trpc.subjectPhoto.list.useQuery(slug);
  const createModel = trpc.model.create.useMutation({
    onSuccess: () => {
      router.push(`/subject/${slug}`);
      return false;
    },
    onError: () => {
      toast.error("Failed to create model");
    }
  });

  if(subject.isLoading || photos.isLoading) {
    return <>Loading...</>;
  }
  if(!subject.data) {
    return <>Subject not found</>;
  }
  if(photos.data == undefined) {
    return <>Photos not found</>;
  }
  const photo = photos.data[0];
  if(!photo) {
    return <>No photos</>;
  }

  const currentModel = {
    subjectSlug: subject.data.slug,
    regularization: modelClass,
    name,
    parentModelCode: (parentModelRef.current?.value || "")  as ModelName,
  }
  const parsed = modelCreateSchema.safeParse(currentModel);

  return <Layout>
    <h2 className="text-2xl font-extrabold leading-normal tracking-tight">
      Model for Subject {subject.data.slug}
    </h2>
    <picture>
      <source srcSet={photoUrl(photo)} type="image/png" />
      <img
        className="w-48 rounded shadow"
        alt="Photo of subject"
      />
    </picture>
    <form className="flex flex-col gap-2" onSubmit={e => {
      e.preventDefault();
    createModel.mutate(currentModel)}
    }>
      <label >Model name
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Model name" type="text" name="name" id="name" className="form-input mt-1 block w-full" />
      </label>
      <ModelClassSelect onChange={newModelClass => setModelClass(newModelClass)} />

      <label>Parent model</label>
      <select ref={parentModelRef} name="parent" id="parent" className="form-select mt-1 block w-full" defaultValue={defaultModel}>
        {[...parentModels.keys()].map((model) => <option key={model} value={model}>{model}</option>)}
      </select>

      <Button className="w-fit disabled:opacity-50" disabled={!parsed.success}>
        Train
      </Button>
      {!parsed.success && (
        <ul>
          {parsed.error.errors.map((error) => (
            <li key={error.code}>{error.message}</li>
          ))}
        </ul>
      )}
    </form>
  </Layout>;
}

export default ModelNew;
