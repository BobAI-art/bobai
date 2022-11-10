import { adminProcedure, router } from "../trpc";
import { env } from "../../../env/server.mjs";
import { z } from "zod";

const params = {
  verified: { eq: "true" },
  external: { eq: false },
  rentable: { eq: "true" },
  disk_space: { gt: "59" },
  inet_down: { gt: "30" },
  inet_up: { gt: "30" },
  gpu_ram: { gt: "23900.0" },
  dph_total: { lt: "1" },
  order: [["score", "desc"]],
  type: "on-demand",
};

interface AvailableInstancesResponse {
  offers: {
    is_bid: boolean;
    external: boolean;
    // webpage: null,
    logo: string;
    public_ipaddr: string;
    geolocation: string;
    host_id: number;
    id: number;
    bundle_id: number;
    num_gpus: number;
    total_flops: number;
    min_bid: number;
    dph_base: number;
    dph_total: number;
    gpu_name: string;
    gpu_ram: number;
    gpu_mem_bw: number;
    bw_nvlink: number;
    cpu_name: string;
    mobo_name: string;
    disk_space: number;
    disk_name: string;
    inet_up: number;
    inet_down: number;
    storage_cost: number;
    inet_up_cost: number;
    inet_down_cost: number;
    storage_total_cost: number;
    verification: string;
    score: 104.38146738739009;
    rented: boolean;
  }[];
}

const getModelTrainerOptions = (type: "model" | "prompt") => {
  return {
    client_id: "me",
    image: "portraits/model-trainer:latest",
    env: {
      "-p 22:22": "1",
    },
    disk: 60.0,
    runtype: "ssh_direct args",
    image_login: `-u portraits -p ${env.DOCKER_IO_PASSWORD} docker.io`,
    args: ["-m", type === "model" ? "portraits.train" : "portraits.prompts"],
  };
};

export const vastRouter = router({
  availableInstances: adminProcedure.query(async () => {
    const query = JSON.stringify(params);
    const response = await fetch(
      `https://vast.ai/api/v0/bundles?q=${query}&api_key=${env.VAST_API_KEY}`
    );
    return (await response.json()) as AvailableInstancesResponse;
  }),
  create: adminProcedure
    .input(
      z.object({
        instanceId: z.number(),
        type: z.enum(["model", "prompt"]),
      })
    )
    .mutation(({ ctx, input }) => {
      const { instanceId } = input;
      const url = `https://vast.ai/api/v0/asks/${instanceId}/?api_key=${env.VAST_API_KEY}`;
      return fetch(url, {
        method: "PUT",
        body: JSON.stringify(getModelTrainerOptions(input.type)),
      });
    }),
});
