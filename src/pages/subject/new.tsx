import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import { z } from "zod";
import Button from "../../components/Button";
import { Layout } from "../../components/Layout";
import { useDebounce } from "../../hooks/tools";
import { subjectSchema } from "../../utils/schema";
import { trpc } from "../../utils/trpc";
import Form from "../../components/Form";
import FormRow from "../../components/FormRow";
import ErrorList from "../../components/ErrorList";
import H1 from "../../components/H1";

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
  const extraErrors = slugExists?.exists
    ? [
        {
          code: "slug-exists",
          message: `Model with slug {debounced.slug} already exists`,
        },
      ]
    : [];
  return (
    <>
      <Layout>
        <H1>New subject</H1>
        <Form onSubmit={handleCreateSubject}>
          <FormRow
            label="Slug"
            component="input"
            helpText="url friendly name"
            placeholder="slug"
            value={subject.slug}
            onChange={(e) => handleSlugChanged(e.target.value)}
          />
          <FormRow
            label="Description"
            component="textarea"
            value={subject.description}
            onChange={(e) => handleDescriptionChanged(e.target.value)}
            placeholder="description"
            className="form-input mt-1 block w-full"
          />
          <Button disabled={!canSave}>Create</Button>
        </Form>
        <ErrorList validated={validated} extra={extraErrors} />
      </Layout>
    </>
  );
};

export default SubjectNew;
