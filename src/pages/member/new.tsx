import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Button from "../../components/Button";
import { Layout } from "../../components/Layout";
import { useDebounce } from "../../hooks/tools";
import { userSchema } from "../../utils/schema";
import { trpc } from "../../utils/trpc";

const MemberNew: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
  });
  const [name, setName] = useState(session?.user?.name || "");
  const debouncedName = useDebounce(name, 500);
  const [changed, setChanged] = useState(false);

  const nameCheck = userSchema.name.safeParse(debouncedName);
  const setNameMutation = trpc.user.setName.useMutation({
    onSuccess: () => {
      router.push("/");
      return false;
    },
  });
  const { isLoading, data: existCheck } = trpc.user.nameAllowed.useQuery(
    debouncedName,
    {
      enabled: nameCheck.success && changed,
    }
  );

  const canSave =
    (!isLoading &&
      nameCheck.success &&
      existCheck?.allowed &&
      name === debouncedName) ||
    !changed;

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  if (!session?.user) {
    return <>Loading ...</>;
  }

  const handleSaveUsername = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!changed) {
      router.push("/");
    }
    setNameMutation.mutate(debouncedName);
  };

  const handleNameChanged = (newName: string) => {
    setName(newName);
    setChanged(true);
  };

  return (
    <>
      <Layout>
        <h1>Welcome to AI Portraits, confirm your username</h1>
        <form className="flex gap-2" onSubmit={handleSaveUsername}>
          <label>
            Username
            <input
              placeholder="username"
              value={name}
              onChange={(e) => handleNameChanged(e.target.value)}
            />
          </label>
          <Button disabled={!canSave}>Confirm</Button>
        </form>
        {nameCheck.success || !changed ? null : (
          <ul>
            {nameCheck.error.errors.map((error) => (
              <li key={error.code}>{error.message}</li>
            ))}
          </ul>
        )}
      </Layout>
    </>
  );
};

export default MemberNew;
