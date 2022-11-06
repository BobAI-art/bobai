import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { z } from "zod";
import Button from "../../components/Button";
import { Layout } from "../../components/Layout";
import { useDebounce } from "../../hooks/tools";
import { subjectSchema } from "../../utils/schema";
import { trpc } from "../../utils/trpc";

const MemberNew: NextPage = () => {
  const router = useRouter();
  useSession({
    required: true,
  });
  const [model, setModel] = useState({ slug: "", description: "" });
  const debouncedModel = useDebounce(model, 500);
  const [changed, setChanged] = useState(false);
  const validator = z.object(subjectSchema);
  const validated = validator.safeParse(debouncedModel);
  const createSubject = trpc.subject.create.useMutation({
    onSuccess: (subject) => {
      router.push({
        pathname: "/subject/[slug]",
        query: { slug: subject.slug },
      });
    },
  });
  const { isLoading, data: slugExists } = trpc.subject.slugExists.useQuery(
    debouncedModel.slug,
    {
      enabled: validated.success && changed,
    }
  );

  const canSave =
    !isLoading && validated.success && !slugExists?.exists && changed;

  const handleCreateModel = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSubject.mutate(debouncedModel);
  };

  const handleSlugChanged = (newSlug: string) => {
    setModel({ ...model, slug: newSlug });
    setChanged(true);
  };

  const handleDescriptionChanged = (newDescription: string) => {
    setModel({ ...model, description: newDescription });
    setChanged(true);
  };

  return (
    <>
      <Layout>
        <h1>New model</h1>
        <form className="flex flex-col gap-2" onSubmit={handleCreateModel}>
          <label>
            Slug
            <input
              placeholder="slug"
              value={model.slug}
              onChange={(e) => handleSlugChanged(e.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              value={model.description}
              onChange={(e) => handleDescriptionChanged(e.target.value)}
              placeholder="description"
            />
          </label>
          <Button className="w-fit disabled:opacity-50" disabled={!canSave}>
            Create
          </Button>
        </form>
        {(!validated.success && changed) || slugExists?.exists ? (
          <ul>
            {!validated.success &&
              validated.error.errors.map((error) => (
                <li key={error.code}>{error.message}</li>
              ))}
            {slugExists?.exists && (
              <li>Model with slug {debouncedModel.slug} already exists</li>
            )}
          </ul>
        ) : null}
      </Layout>
    </>
  );
};

export default MemberNew;
