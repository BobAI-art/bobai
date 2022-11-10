import type { NextPage } from "next";
import { Layout } from "../components/Layout";
import H1 from "../components/H1";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import usePromptsStats from "../hooks/admin/usePromptsStats";
import H2 from "../components/H2";
import useModelsStats from "../hooks/admin/useModelsStats";
import useAvailableVastInstances from "../hooks/admin/useAvailableVastInstances";
import { classNames } from "../toolbox";
import { trpc } from "../utils/trpc";
import { toast } from "react-hot-toast";

const MODEL_TRAINER_MIN_MEM = 25 * 1024;

const FromAggregation: React.FC<{
  title: string;
  stats: { label: string; count: number }[];
}> = ({ stats, title }) => (
  <div className="mb-2">
    <H2 className="py-1">{title}</H2>
    <ul className="grid grid-cols-2  gap-4 sm:grid-cols-3">
      {stats?.map((stat) => (
        <li key={stat.label} className="rounded-md border bg-white p-4 shadow ">
          <div className="capitalize">{stat.label}</div>
          <div className="text-2xl font-extrabold">{stat.count}</div>
        </li>
      ))}
    </ul>
  </div>
);

const Home: NextPage = () => {
  const router = useRouter();
  const { data: promptsStats } = usePromptsStats();
  const { data: modelStats } = useModelsStats();
  const { data: instances } = useAvailableVastInstances();
  const session = useSession({
    required: true,
  });
  const createInstanceMutation = trpc.vast.create.useMutation({
    onSuccess: () => {
      toast.success("Instance created");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  if (session.status === "loading") {
    return <Layout>Loading...</Layout>;
  }
  if (session.data?.user?.email !== "damian@swistowski.org") {
    router.push("/");
  }
  return (
    <>
      <Layout>
        <H1>Admin</H1>
        {promptsStats && (
          <FromAggregation
            title="Prompts queue"
            stats={promptsStats.map((stat) => ({
              label: stat.status.toLocaleLowerCase(),
              count: stat._count,
            }))}
          />
        )}
        {modelStats && (
          <FromAggregation
            title="Models queue"
            stats={modelStats.map((stat) => ({
              label: stat.state.toLocaleLowerCase(),
              count: stat._count,
            }))}
          />
        )}
        {instances && (
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-left text-sm text-gray-500 "></table>
              <caption className="bg-white p-5 text-left text-lg font-semibold text-gray-900">
                Instances to rent
              </caption>
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Location
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Ram
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Inet
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Price
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {instances.offers
                  .sort(
                    (a, b) =>
                      (a.gpu_ram > MODEL_TRAINER_MIN_MEM ? -2 : 0) +
                      (b.gpu_ram > MODEL_TRAINER_MIN_MEM ? 2 : 0) +
                      (a.dph_total > b.dph_total ? 1 : -1)
                  )
                  .map((offer) => (
                    <tr
                      key={offer.id}
                      className={classNames(
                        "border-b bg-white"
                        // offer.verification === "de-verified"
                        //   ? "bg-amber-600"
                        //   : "",
                        // offer.verification === "unverified"
                        //   ? "bg-amber-300"
                        //   : "",
                        // offer.verification === "verified" ? "bg-green-300" : ""
                      )}
                    >
                      <th
                        scope="row"
                        className="whitespace-nowrap py-4 px-6 font-medium text-gray-900"
                      >
                        {offer.num_gpus > 1 ? `${offer.num_gpus}x` : ""}
                        {offer.gpu_name}
                      </th>
                      <td className="py-4 px-6">{offer.geolocation}</td>
                      <td className="py-4 px-6">
                        {(offer.gpu_ram / 1024).toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        {(offer.inet_down / 1024).toFixed(2)}/
                        {(offer.inet_up / 1024).toFixed(2)} GBps
                      </td>
                      <td className="py-4 px-6">
                        ${offer.dph_total.toFixed(2)}/h
                      </td>
                      <td className="py-4 px-6">
                        {offer.gpu_ram > MODEL_TRAINER_MIN_MEM ? (
                          <a
                            href="#"
                            onClick={() => {
                              createInstanceMutation.mutate({
                                instanceId: offer.id,
                                type: "model",
                              });
                            }}
                            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                          >
                            New Model Trainer
                          </a>
                        ) : (
                          <a
                            href="#"
                            onClick={() => {
                              createInstanceMutation.mutate({
                                instanceId: offer.id,
                                type: "prompt",
                              });
                            }}
                            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                          >
                            New Prompt Generator
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Home;
