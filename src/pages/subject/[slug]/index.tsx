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
import PhotosGrid from "../../../components/PhotosGrid";
import usePageScrollPhotos from "../../../hooks/usePageScrollPhotos";
import Subject from "../../../components/Subject";
import Modal from "../../../components/Modal";
import { SubjectPhoto } from "@prisma/client";
import { TrainedDeciption } from "../../../components/TrainedDeciption";

const imagesNeeded = {
  "full-body": 3,
  "upper-body": 5,
  face: 12,
};
export const allImages = Object.values(imagesNeeded).reduce((a, b) => a + b, 0);

const ChangeCoverModal: React.FC<{
  onClose: () => void;
  onSelect: (selectedPhoto: string | null) => void;
  photos: SubjectPhoto[];
}> = ({ onClose, photos, onSelect }) => (
  <Modal onClose={onClose} title="Select cover photo">
    <ul className="grid grid-cols-4 gap-2">
      {photos.map((photo) => (
        <li key={photo.id} className="overflow-hidden">
          <Image
            className="hover:scale-transition-transform cursor-pointer duration-300 hover:scale-110"
            src={photoUrl(photo)}
            alt={`Photo of ${photo.subject_slug}`}
            width={512}
            height={512}
            onClick={() => {
              onSelect(photoUrl(photo));
              console.log(photoUrl(photo));
            }}
          />
        </li>
      ))}
    </ul>
  </Modal>
);

const SubjectBySlug: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  const [changeCoverModelIsOpen, setChangeCoverModelIsOpen] =
    React.useState(false);
  const slug = router.query.slug as string;

  const { data: subject, refetch } = trpc.subject.get.useQuery(slug);
  const setCoverUrl = trpc.subject.setCover.useMutation({
    onSuccess: () => {
      toast.success("Cover photo updated");
      refetch();
      setChangeCoverModelIsOpen(false);
    },
    onError: () => {
      toast.error("Error updating cover photo");
    },
  });

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

  const { data: gridPhotos } = usePageScrollPhotos({
    subjectSlug: slug,
  });

  if (!subject || !subject.slug) {
    return <>Model not found</>;
  }
  if (photos == undefined) {
    return <>Photos not found</>;
  }
  const isOwner = subject.owner_id === session?.data?.user?.id;

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
      {changeCoverModelIsOpen && (
        <ChangeCoverModal
          onClose={() => setChangeCoverModelIsOpen(false)}
          photos={photos}
          onSelect={(selectedPhoto) => {
            if (selectedPhoto) {
              setCoverUrl.mutate({
                photoUrl: selectedPhoto,
                subjectSlug: subject.slug,
              });
              setChangeCoverModelIsOpen(false);
            }
          }}
        />
      )}

      <h2 className="text-2xl font-extrabold leading-normal tracking-tight">
        Subject {subject.slug}
      </h2>

      <div className="flex gap-2">
        <Subject subject={subject} className="max-w-[128px]" />
        {isOwner && (
          <div>
            <Button onClick={() => setChangeCoverModelIsOpen(true)}>
              Change cover
            </Button>
          </div>
        )}
      </div>

      <h3 className="text-xl font-extrabold leading-normal tracking-tight">
        Depictions
      </h3>
      <ul className="flex flex-wrap gap-2">
        {subject.depiction.map((depiction) => (
          <li key={depiction.id} className="w-[192px]">
            <Link
              href={{
                pathname: "/depiction/[id]",
                query: { id: depiction.id },
              }}
            >
              <TrainedDeciption depiction={depiction} />
            </Link>
          </li>
        ))}

        <li className="aspect-square w-[192px] overflow-hidden">
          <Link
            href={{
              pathname: "/subject/[slug]/model/new",
              query: { slug },
            }}
          >
            <Button className="aspect-square">
              <div>
                <PlusCircleIcon className="inline w-4" /> Hey Bob, lets learn
                you a new{" "}
                <span className="font-bold">{subject.slug}&apos;s</span>{" "}
                depiction
              </div>
            </Button>
          </Link>
        </li>
      </ul>

      <PhotosGrid photos={gridPhotos}></PhotosGrid>
    </Layout>
  );
};

export default SubjectBySlug;
