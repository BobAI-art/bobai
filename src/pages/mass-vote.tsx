import type { NextPage } from "next";
import { Layout } from "../components/Layout";
import React, { useEffect } from "react";
import { AppRouterTypes, trpc } from "../utils/trpc";
import Photo from "../components/Photo";
import useVote from "../hooks/useVote";
import Voting from "../components/Voting";

const MassVote: NextPage = () => {
  const voteMutation = useVote({
    onSuccessfulVote: (id: string) =>
      setPhotos((photos) => photos.filter((p) => p.id !== id)),
    onFailedVote: () => setPhotos(photos.slice(1)),
  });
  const [photos, setPhotos] = React.useState<
    AppRouterTypes["photos"]["toVote"]["output"]
  >([]);

  const { refetch, isLoading } = trpc.photos.toVote.useQuery(
    {
      count: 25,
      maxVotes: 1,
    },
    {
      staleTime: Infinity,
      onSuccess: (data) => {
        setPhotos(data);
      },
    }
  );
  useEffect(() => {
    if (photos.length === 0) refetch();
  }, [photos]);
  return (
    <Layout>
      {photos[0] && (
        <div className="m-auto flex w-fit flex-col items-center p-2">
          <div className="flex gap-2">
            <div className="rounded bg-site-pink-600 p-2 shadow">
              Style: {photos[0].style_slug}
            </div>
            <div className="rounded bg-site-pink-600 p-2 shadow">
              Model: {photos[0].depiction?.name || ""}
            </div>
          </div>
          <div className="w-fit w-[512px]">{photos[0].prompt}</div>
          <Photo photo={photos[0]} />
          <Voting
            onVote={(vote: number) =>
              photos[0] && voteMutation.mutate({ vote, id: photos[0].id })
            }
            disabled={!photos[0] || voteMutation.isLoading}
          />
        </div>
      )}
    </Layout>
  );
};

export default MassVote;
