import React from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Layout } from "../../components/Layout";
import usePhoto from "../../hooks/usePhoto";
import Photo from "../../components/Photo";
import Voting from "../../components/Voting";
import useVote from "../../hooks/useVote";
import moment from "moment/moment";
import { toast } from "react-hot-toast";
import Button from "../../components/Button";
import Link from "next/link";
import { Prompt } from "../../components/Prompt";

const PhotoDetails: NextPage = () => {
  const router = useRouter();
  const photoId = router.query.id as string;
  const { data: photo, isLoading } = usePhoto(photoId);
  const voteMutation = useVote({
    onSuccessfulVote: (id: string) => {
      toast.success("Thanks for voting!");
    },
  });

  if (isLoading)
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  if (!photo)
    return (
      <Layout>
        <div>Photo not found</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="flex flex-col rounded-lg bg-white shadow-lg lg:w-full lg:flex-row">
          <Photo
            photo={photo}
            showModal={false}
            className="w-full min-w-full rounded-t-lg lg:w-[512px] lg:min-w-[512px] lg:rounded-none lg:rounded-l-lg"
          />

          <div className="flex flex-col justify-start p-6">
            <Prompt id={photo.prompt_id} content={photo.prompt} />
            {photo.depiction && (
              <Link
                href={{
                  pathname: "/depiction/[id]",
                  query: { id: photo?.depiction.id },
                }}
              >
                <p className="mb-4 text-base text-gray-700">
                  Depiction: {photo.depiction.name}
                </p>
              </Link>
            )}
            {photo?.depiction && (
              <div className="text-gray-900">
                Subject{" "}
                <Link
                  href={{
                    pathname: "/subject/[slug]",
                    query: { slug: photo?.depiction.subject.slug },
                  }}
                >
                  {photo?.depiction.subject.slug}
                </Link>
              </div>
            )}
            <p className="mb-4 text-base text-gray-700">
              <Link
                href={{
                  pathname: "/style/[slug]",
                  query: { slug: photo.style_slug },
                }}
              >
                Style: {photo.style.slug}
              </Link>
            </p>
            <p className="text-xs text-gray-600">
              Created {moment(photo.created).fromNow()}
            </p>
            <Voting
              onVote={(vote: number) =>
                voteMutation.mutate({ vote, id: photo.id })
              }
              disabled={false}
              className="w-fit gap-2"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => toast.error("Not implemented yet")}>
                Generate similar
              </Button>
              <Button onClick={() => toast.error("Not implemented yet")}>
                Share
              </Button>
              <Button onClick={() => toast.error("Not implemented yet")}>
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PhotoDetails;
