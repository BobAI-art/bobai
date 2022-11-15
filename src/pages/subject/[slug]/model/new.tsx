import { NextPage } from "next";
import { Layout } from "../../../../components/Layout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "../../../../utils/trpc";
import { photoUrl } from "../../../../utils/helpers";
import Button from "../../../../components/Button";
import React, { useState } from "react";
import {
  defaultModelClass,
} from "../../../../utils/consts";
import { ModelClassSelect } from "../../../../components/ModelClassSelect";
import { modelCreateSchema } from "../../../../utils/schema";
import toast from "react-hot-toast";
import Form from "../../../../components/Form";
import Image from "next/image";
import { classNames } from "../../../../toolbox";
import FormRow from "../../../../components/FormRow";

const ModelNew: NextPage = () => {
  const [modelClass, setModelClass] = React.useState<string>(defaultModelClass);
  const [name, setName] = React.useState<string>("");
  const router = useRouter();
  const parentModelRef = React.useRef<HTMLSelectElement>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    },
  });
  const { data: parentModels} = trpc.parentModel.list.useQuery({});
  const defaultModel = parentModels?.[0];

  if (subject.isLoading || photos.isLoading) {
    return <>Loading...</>;
  }
  if (!subject.data) {
    return <>Subject not found</>;
  }
  if (photos.data == undefined) {
    return <>Photos not found</>;
  }
  const photo = photos.data[0];
  if (!photo) {
    return <>No photos</>;
  }

  const currentModel = {
    subjectSlug: subject.data.slug,
    regularization: modelClass,
    name,
    parentModelCode: parentModelRef.current?.value || ""
  };
  const parsed = modelCreateSchema.safeParse(currentModel);
  if(!parentModels) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <Layout>
      <h2 className="text-2xl font-extrabold leading-normal tracking-tight">
        Model for Subject {subject.data.slug}
      </h2>
      <div className="aspect-square w-48">
        <Image
          alt="subject example photo"
          src={photoUrl(photo)}
          width={512}
          height={512}
          className="rounded shadow"
        />
      </div>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          createModel.mutate(currentModel);
        }}
      >
        <FormRow label="Model name" component="input" value={name}
                 onChange={(e) => setName(e.target.value)}
                 placeholder="Model name"
                 name="name"
                 id="name"/>
        <label
          htmlFor="checked-toggle"
          className="relative inline-flex cursor-pointer items-center"
        >
          <input
            type="checkbox"
            // value={false}
            id="checked-toggle"
            className="peer sr-only"
            checked={showAdvanced}
            onClick={() => setShowAdvanced((current) => !current)}
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
          <span className="ml-3 text-sm font-medium text-gray-900">
            {showAdvanced ? "Advanced" : "Simple"}
          </span>
        </label>

        <div className={classNames(showAdvanced ? "" : "hidden")}>
          <ModelClassSelect
            onChange={(newModelClass) => setModelClass(newModelClass)}
          />

          <label>Parent model</label>
          <select
            ref={parentModelRef}
            name="parent"
            id="parent"
            className="form-select mt-1 block w-full"
            defaultValue={defaultModel?.code}
          >
            {parentModels.map((model) => (
              <option key={model.code} value={model.code}>
                {model.code}
              </option>
            ))}
          </select>
        </div>
        <Button
          className="w-fit disabled:opacity-50"
          disabled={!parsed.success}
        >
          Train
        </Button>
        {!parsed.success && (
          <ul>
            {parsed.error.errors.map((error) => (
              <li key={error.code}>{error.message}</li>
            ))}
          </ul>
        )}
      </Form>
    </Layout>
  );
};

export default ModelNew;
