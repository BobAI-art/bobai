import React from "react";
import { trpc } from "../utils/trpc";
import { Toggle } from "./Toggle";

export const PublicToggle: React.FC<{
  item: { is_public: boolean; id: string };
  onSuccess?: () => void;
  type: "photos";
}> = ({ item, onSuccess, type }) => {
  const changePublicStatus = trpc[type].changePublicStatus.useMutation({
    onSuccess,
  });

  return (
    <Toggle
      value={item.is_public}
      disabled={changePublicStatus.isLoading}
      onChange={(value) =>
        changePublicStatus.mutate({
          id: item.id,
          isPublic: value,
        })
      }
    >
      <span className="mb-4 text-base text-gray-700">
        {item.is_public ? "Public" : "Private"}
      </span>
    </Toggle>
  );
};
