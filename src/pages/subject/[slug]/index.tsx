import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout } from "../../../components/Layout";
import { trpc } from "../../../utils/trpc";
import { SubjectPhotos } from "../../../components/SubjectPhotos";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Button from "../../../components/Button";
import Link from "next/link";
import moment from "moment/moment";

const imagesNeeded = {
  "full-body": 3,
  "upper-body": 5,
  face: 12,
};
export const allImages = Object.values(imagesNeeded).reduce((a, b) => a + b, 0);

const SubjectBySlug: NextPage = () => {
  const router = useRouter();
  useSession({
    required: true,
  });
  const slug = router.query.slug as string;

  const subjectQuery = trpc.subject.get.useQuery(slug);
  const photos = trpc.subjectPhoto.list.useQuery(slug);

  if (subjectQuery.isLoading || photos.isLoading) {
    return <>Loading...</>;
  }
  const subject = subjectQuery.data;
  if (!subject) {
    return <>Model not found</>;
  }
  if(photos.data == undefined) {
    return <>Photos not found</>;
  }

  return (
    <Layout>
      <h2 className="text-2xl font-extrabold leading-normal tracking-tight">
        Subject {subject.slug}
      </h2>

      <SubjectPhotos photos={photos.data} subject={subject} howMany={allImages} onPhotosChanged={() => photos.refetch()}  />
      <h3 className="text-xl font-extrabold leading-normal tracking-tight">Models</h3>
      <ul>
        {subject.models.map((model) => (
          <li key={model.id}>
            <Link
              href={{
                pathname: "/subject/[slug]/model/[id]",
                query: { slug: subject.slug, id: model.id },
              }}
            >
            <a>{model.name} <i>{model.state}</i> <b>{model.parent_model_code}</b>, Created: {moment(model.created).fromNow()}</a>
            </Link>
          </li>
          ))}

        {photos.data.length >= allImages && (<li><Button>
          <Link
            href={{
              pathname: "/subject/[slug]/model/new",
              query: { slug },
            }}
          >

              <div className="flex gap-2">
                <PlusCircleIcon className="w-4" /> Add new model
              </div>
          </Link>
        </Button></li>)}
      </ul>
    </Layout>
  );
};

export default SubjectBySlug;
