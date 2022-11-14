import {
  getCsrfToken,
  getProviders,
  signIn,
  useSession
} from "next-auth/react";
import { useRouter } from "next/router";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react/types";
import { BuiltInProviderType } from "next-auth/providers";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import H1 from "../../components/H1";
import { classNames } from "../../toolbox";
import { Layout } from "../../components/Layout";
import Button from "../../components/Button";

export default function SignIn({
                                 providers,
                                 csrfToken
                               }: {
  csrfToken: string;
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [pin, setPin] = useState("");
  const callbackUrl = (router.query.callbackUrl as string) || "";
  const checkPin = trpc.auth.checkPin.useMutation();
  // const checkPin = trpc.useMutation("auth.pin");

  const isLoggedIn = !!session?.user;
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn]);

  return (
    <Layout>
      <div className="flex gap-4 flex-col max-w-sm m-auto border border-site-brand-500 rounded px-8 py-4">
        {/*<Image*/}
        {/*  className="self-center"*/}
        {/*  src="/dog-alone.svg"*/}
        {/*  width={150}*/}
        {/*  height={150}*/}
        {/*/>*/}
        <H1>Bob AI sign in</H1>

        {checkPin.data ? (
          <>
            <hr />
            {Object.values(providers || [])
              .filter(({ id }) => id !== "email")
              .map((provider) => (
                <Button
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl })}
                >
                  Sign in with {provider.name}
                </Button>
              ))}
            <hr className="m-4" />
            <form
              className="flex flex-col gap-2"
              method="post"
              action="/api/auth/signin/email"
            >
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <input
                className="py-1 px-2 border border-site-brand-300 rounded"
                type="email"
                id="email"
                name="email"
                placeholder="email"
              />
              <Button type="submit">Sign in with Email</Button>
            </form>
          </>
        ) : (
          <>
            <p>
              currently service is invite only, please privide your pin to login
            </p>
            <input
              className={classNames(
                "py-1 px-2 border border-site-brand-300 rounded",
                checkPin.data === false ? "border-red-500" : ""
              )}
              placeholder="pin"
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value)
                checkPin.mutate({ pin: e.target.value })
                }}
              onBlur={() => checkPin.mutate({ pin })}
            />

            <p>
              Please contact{" "}
              <a href="mailto:support@bobai.art">support@bobai.art</a> for
              your beta tester key
            </p>
          </>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  return {
    props: { providers, csrfToken }
  };
};
