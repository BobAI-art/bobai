import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import Button from "./Button";
import Photo from "./Photo";

export const PhotosGrid: React.FC<{ promptId?: string }> = ({ promptId }) => {
  const perPage = 2 * 4 * 6 * 2;
  const [page, setPage] = useState(0);
  const { data: generatedPhotos } = trpc.photos.list.useQuery(
    {
      promptId,
      skip: page * perPage,
      limit: perPage,
    },
    {}
  );
  const navigation = (
    <div className="flex justify-between">
      <Button disabled={page === 0} onClick={() => setPage((page) => page - 1)}>
        Prev
      </Button>
      {page}
      <Button onClick={() => setPage((page) => page + 1)}>Next</Button>
    </div>
  );

  return (
    <div>
      {navigation}
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {generatedPhotos?.map((photo) => (
          <li key={photo.id}>
            <Photo photo={photo} />
          </li>
        ))}
      </ul>
      {navigation}
    </div>
  );
};
