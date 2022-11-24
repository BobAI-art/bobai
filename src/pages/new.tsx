import type { NextPage } from "next";
import { Layout } from "../components/Layout";
import React from "react";
import H1 from "../components/H1";
import { useSession } from "next-auth/react";
import { PromptEditor } from "../components/PromptEditor";
import H3 from "../components/H3";
import useMyDepictions from "../hooks/useMyDepictions";

const SelectModel: React.FC<{
  onModelSelected: (model: string) => void;
}> = () => {
  const { data: depictions, isLoading } = useMyDepictions();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <H3>What I&apos;m painting?</H3>
      <ul>
        {depictions?.map((depiction) => (
          <li key={depiction.id}>{depiction.name}</li>
        ))}
      </ul>
    </>
  );
};

const Home: NextPage = () => {
  const [state, setState] = React.useState<"select-model" | "generate-prompt">(
    "select-model"
  );
  useSession({ required: true });

  return (
    <Layout>
      <H1 className="my-4">Hi Bob!, please paint:</H1>
      {state === "select-model" && (
        <SelectModel onModelSelected={() => setState("generate-prompt")} />
      )}
      {state === "generate-prompt" && <PromptEditor />}
    </Layout>
  );
};

export default Home;
