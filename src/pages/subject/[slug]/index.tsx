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
import React from "react";
import H2 from "../../../components/H2";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { photoUrl } from "../../../utils/helpers";

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

  const { data: subject, refetch } = trpc.subject.get.useQuery(slug);
  const finish = trpc.subject.finish.useMutation({
    onSuccess: async () => {
      toast.success("Subject created");
      await refetch();
    },
    onError: () => {
      toast.error("Failed to finish subject");
    },
  });
  const { data: photos, refetch: photosRefetch } =
    trpc.subjectPhoto.list.useQuery(slug);

  if (!subject || !subject.slug) {
    return <>Model not found</>;
  }
  if (photos == undefined) {
    return <>Photos not found</>;
  }

  if (!subject.finished) {
    return (
      <Layout>
        <H2>
          Upload photos for{" "}
          <span className="font-extrabold">{subject.slug}</span>
        </H2>
        <p className="text-gray-500">
          You need to upload at least {allImages} photos for this subject.
          Minimum photo size is 512x512px.
        </p>
        <SubjectPhotos
          photos={photos}
          subject={subject}
          howMany={allImages}
          onPhotosChanged={photosRefetch}
        />
        {photos.length >= allImages && (
          <Button disabled={finish.isLoading} onClick={() => finish.mutate()}>
            <PlusCircleIcon className="w-4" /> Finish adding subject
          </Button>
        )}
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-2xl font-extrabold leading-normal tracking-tight">
        Subject {subject.slug}
      </h2>
      <div className="aspect-square w-48">
        {photos[0] && (
          <Image
            alt="subject example photo"
            src={photoUrl(photos[0])}
            width={512}
            height={512}
            className="rounded shadow"
          />
        )}
      </div>
      <h3 className="text-xl font-extrabold leading-normal tracking-tight">
        Depictions
      </h3>
      <ul>
        {subject.depiction.map((depiction) => (
          <li key={depiction.id}>
            <Link
              href={{
                pathname: "/depiction/[id]",
                query: { id: depiction.id },
              }}
            >
              {depiction.name} <i>{depiction.state}</i>{" "}
              <b>{depiction.style_slug}</b>, Created:{" "}
              {moment(depiction.created).fromNow()}
            </Link>
          </li>
        ))}

        <li>
          <Link
            href={{
              pathname: "/subject/[slug]/model/new",
              query: { slug },
            }}
          >
            <Button>
              <div className="flex gap-2">
                <PlusCircleIcon className="w-4" /> Hey Bob, lets learn you a new{" "}
                <span className="font-bold">{subject.slug}&apos;s</span>{" "}
                depiction
              </div>
            </Button>
          </Link>
        </li>
      </ul>
    </Layout>
  );
};

export default SubjectBySlug;
