import React from "react";
import { Subject as SubjectModel } from "@prisma/client";
import { ImageWithLabel } from "./ImageWithLabel";

const Subject: React.FC<{ subject: SubjectModel; className?: string }> = ({
  subject,
  className,
}) => (
  <ImageWithLabel
    photoUrl={subject.photoUrl}
    photoWidth={512}
    photoHeight={512}
    label={subject.slug}
    className={className}
  />
);
export default Subject;
