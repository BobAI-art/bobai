import React from "react";
import Button from "./Button";
import { classNames } from "../toolbox";

const ranking = ["💩", "🤷🏼‍♂️", "👌", "❤️", "🔥"];

const Voting: React.FC<{
  onVote: (vote: number) => void;
  disabled: boolean;
  className?: string;
}> = ({ onVote, disabled, className }) => (
  <div
    className={classNames("flex w-full justify-between py-2", className || "")}
  >
    {ranking.map((v, i) => (
      <Button
        className={classNames(i % 2 == 1 ? "hidden md:block" : "")}
        disabled={disabled}
        onClick={() => onVote(i)}
        key={i}
      >
        {v}
      </Button>
    ))}
  </div>
);

export default Voting;
