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

const SubjectNew: NextPage = () => {
  const router = useRouter();
  useSession({
    required: true,
  });
  const [subject, setSubject] = useState({ slug: "", description: "" });
  const debounced = useDebounce(subject, 500);
  const [changed, setChanged] = useState(false);
  const validator = z.object(subjectSchema);
  const validated = validator.safeParse(debounced);
  const createSubject = trpc.subject.create.useMutation({
    onSuccess: (subject) => {
      router.push({
        pathname: "/subject/[slug]",
        query: { slug: subject.slug },
      });
    },
  });
  const { isLoading, data: slugExists } = trpc.subject.slugExists.useQuery(
    debounced.slug,
    {
      enabled: validated.success && changed,
    }
  );

  const canSave =
    !isLoading && validated.success && !slugExists?.exists && changed;

  const handleCreateSubject = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSubject.mutate(debounced);
  };

  const handleSlugChanged = (newSlug: string) => {
    setSubject({ ...subject, slug: newSlug });
    setChanged(true);
  };

  const handleDescriptionChanged = (newDescription: string) => {
    setSubject({ ...subject, description: newDescription });
    setChanged(true);
  };

  return (
    <>
      <Layout>
        <h1>New subject</h1>
        <form className="flex flex-col gap-2" onSubmit={handleCreateSubject}>
          <label>
            Slug
            <input
              placeholder="slug"
              value={subject.slug}
              onChange={(e) => handleSlugChanged(e.target.value)}
              className="form-input mt-1 block w-full"
            />
            <p className="size-sm text-slate-500">url friendly name</p>
          </label>
          <label>
            Description
            <textarea
              value={subject.description}
              onChange={(e) => handleDescriptionChanged(e.target.value)}
              placeholder="description"
              className="form-input mt-1 block w-full"
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
              <li>Model with slug {debounced.slug} already exists</li>
            )}
          </ul>
        ) : null}
      </Layout>
    </>
  );
};

export default SubjectNew;
