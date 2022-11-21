import type { NextPage } from "next";
import { Layout } from "../components/Layout";
import React, { useEffect } from "react";
import { trpc } from "../utils/trpc";
import { type Photo as PhotoModel } from "@prisma/client";
import Photo from "../components/Photo";
import Button from "../components/Button";
import { toast } from "react-hot-toast";

const ranking = ["💩", "🤷🏼‍♂️", "👌", "❤️", "🔥"];

const MassVote: NextPage = () => {
  const [photos, setPhotos] = React.useState<PhotoModel[]>([]);
  const voting = trpc.photos.vote.useMutation({
    onSuccess: (data) => {
      if (data) {
        setPhotos((photos) => photos.filter((p) => p.id !== data.id));
      }
    },
    onError: (error) => {
      toast.error(error.message);
      setPhotos(photos.slice(1));
    },
  });
  const { refetch, isLoading } = trpc.photos.toVote.useQuery(
    {
      count: 5,
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
          <div className="w-fit w-[512px]">{photos[0].prompt}</div>
          <Photo photo={photos[0]} />
          <div className="flex w-full justify-between py-2">
            {ranking.map((v, i) => (
              <Button
                disabled={voting.isLoading || isLoading}
                onClick={() => {
                  voting.mutate({
                    id: photos[0]?.id || "",
                    vote: i,
                  });
                }}
                key={i}
              >
                {v}
              </Button>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MassVote;
