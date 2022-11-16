import type { NextPage } from "next";
import { Layout } from "../../components/Layout";
import H1 from "../../components/H1";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import H2 from "../../components/H2";
import useDepictionsStats from "../../hooks/admin/useDepictionsStats";
import useAvailableVastInstances from "../../hooks/admin/useAvailableVastInstances";
import { classNames } from "../../toolbox";
import { trpc } from "../../utils/trpc";
import { toast } from "react-hot-toast";
import useActiveVastInstances from "../../hooks/admin/useActiveVastInstances";
import usePhotosStats from "../../hooks/admin/usePhotosStats";

const MODEL_TRAINER_MIN_MEM = 25 * 1024;

const FromAggregation: React.FC<{
  title: string;
  stats: {
    label: string;
    count: number;
    action?: { label: string; onExecute: () => void };
  }[];
}> = ({ stats, title }) => (
  <div className="mb-2">
    <H2 className="py-1">{title}</H2>
    <ul className="grid grid-cols-2  gap-4 sm:grid-cols-3">
      {stats?.map((stat) => (
        <li
          key={stat.label}
          className="flex rounded-md border bg-white p-4 shadow"
        >
          <div className="flex-grow">
            <div className="capitalize">{stat.label}</div>
            <div className="text-2xl font-extrabold">{stat.count}</div>
          </div>
          {stat.action && (
            <button
              onClick={stat.action.onExecute}
              className="rounded border bg-amber-200 px-2 shadow hover:bg-amber-300"
            >
              {stat.action.label}
            </button>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const TableButton: React.FC<{
  onClick: () => void;
  label: string;
}> = ({ onClick, label }) => (
  <a
    href="#"
    onClick={onClick}
    className="rounded border bg-amber-200 px-2 shadow hover:bg-amber-300"
  >
    {label}
  </a>
);

const instanceName = (runtype: string, args: string[]) => {
  if (runtype === "ssh") {
    return "SSH";
  } else {
    if (args[1] === "portraits.train") {
      return "Train";
    } else if (args[1] === "portraits.prompts") {
      return "Prompts";
    }
  }
  return "Unknown";
};

const Home: NextPage = () => {
  const router = useRouter();
  const { data: modelStats, refetch: modelStatsRefetch } = useDepictionsStats();
  const { data: photosStats, refetch: photosStatsRefetch } = usePhotosStats();
  const { data: instances } = useAvailableVastInstances();
  const { data: activeInstances } = useActiveVastInstances();
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
  const retryPhotosTrainingMutation = trpc.photos.retryFailed.useMutation({
    onSuccess: () => {
      photosStatsRefetch();
      toast.success("Retried");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const retrtyFailedTrainingMutation = trpc.depiction.retryFailed.useMutation({
    onSuccess: () => {
      modelStatsRefetch();
      toast.success("Retried");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (session.status === "loading") {
    return <Layout>Loading...</Layout>;
  }
  if (!session.data?.user?.email?.endsWith("bobai.art")) {
    console.log("wrong email of admin: ", session.data?.user?.email);
    router.push("/");
  }
  return (
    <Layout>
      <H1>Admin</H1>
      {photosStats && (
        <FromAggregation
          title="Photos queue"
          stats={photosStats.map((stat) => ({
            label: stat.status.toLocaleLowerCase(),
            count: stat._count,
            action:
              stat.status === "GENERATING"
                ? {
                    label: "Retry",
                    onExecute: () => {
                      retryPhotosTrainingMutation.mutate();
                    },
                  }
                : undefined,
          }))}
        />
      )}
      {modelStats && (
        <FromAggregation
          title="Models queue"
          stats={modelStats.map((stat) => ({
            label: stat.state.toLocaleLowerCase(),
            count: stat._count,
            action:
              stat.state === "ERROR"
                ? {
                    label: "Retry",
                    onExecute: () => {
                      retrtyFailedTrainingMutation.mutate();
                    },
                  }
                : undefined,
          }))}
        />
      )}
      {activeInstances && activeInstances.instances.length > 0 && (
        <div className="mb-2">
          <H2 className="py-1">Active instances</H2>
          <ul className="grid grid-cols-2  gap-4 sm:grid-cols-3">
            {activeInstances.instances.map((instance) => (
              <li
                key={instance.id}
                className="flex rounded-md border bg-white p-4 shadow"
              >
                <div className="flex-grow">
                  <div>{instance.label}</div>
                  <div className="capitalize">
                    {instanceName(instance.image_runtype, instance.image_args)}
                  </div>
                  <div className="text-2xl font-extrabold">
                    GPU: {(instance.gpu_util || 0).toFixed(2)}%
                  </div>
                  <div className="text-xl font-bold">{instance.gpu_name}</div>
                  <div className="text-sm font-light text-gray-600">
                    {instance.status_msg}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {instances && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-left text-sm text-gray-500 ">
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
                    <td className="flex gap-2 py-4 px-6">
                      <TableButton
                        label="Ssh"
                        onClick={() => {
                          createInstanceMutation.mutate({
                            instanceId: offer.id,
                            type: "ssh",
                          });
                        }}
                      />
                      <TableButton
                        label="Models"
                        onClick={() => {
                          createInstanceMutation.mutate({
                            instanceId: offer.id,
                            type: "model",
                          });
                        }}
                      />
                      <TableButton
                        onClick={() => {
                          createInstanceMutation.mutate({
                            instanceId: offer.id,
                            type: "photo",
                          });
                        }}
                        label="Photos"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Home;
