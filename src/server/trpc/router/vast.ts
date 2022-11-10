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

interface ActiveInstancesResponse {
  instances: {
    is_bid: boolean;
    inet_up_billed: number;
    inet_down_billed: number;
    external: boolean;
    webpage: string | null;
    logo: string;
    rentable: boolean;
    compute_cap: number;
    driver_version: string;
    cuda_max_good: number;
    machine_id: number;
    hosting_type: null;
    public_ipaddr: string;
    geolocation: string;
    flops_per_dphtotal: number;
    dlperf_per_dphtotal: string;
    reliability2: number;
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
    gpu_display_active: false;
    gpu_mem_bw: number;
    bw_nvlink: number;
    direct_port_count: number;
    gpu_lanes: number;
    pcie_bw: number;
    pci_gen: number;
    dlperf: number;
    cpu_name: string;
    mobo_name: string;
    cpu_ram: number;
    cpu_cores: number;
    cpu_cores_effective: number;
    gpu_frac: number;
    has_avx: number;
    disk_space: number;
    disk_name: string;
    disk_bw: number;
    inet_up: number;
    inet_down: number;
    start_date: number;
    end_date: number;
    duration: number;
    storage_cost: number;
    inet_up_cost: number;
    inet_down_cost: number;
    storage_total_cost: number;
    verification: number;
    score: number;
    ssh_idx: string;
    ssh_host: string;
    ssh_port: number;
    actual_status: string;
    intended_status: string;
    cur_state: string;
    next_state: string;
    image_uuid: string; // to show
    image_args: string[]; // to show
    image_runtype: string; // to show
    label: null;
    jupyter_token: string;
    status_msg: string; // to show
    gpu_util: number;
    disk_util: number;
    gpu_temp: number;
    local_ipaddrs: string;
    direct_port_end: number;
    direct_port_start: number;
    cpu_util: number;
    mem_usage: number;
    mem_limit: number;
    vmem_usage: number;
    machine_dir_ssh_port: number;
    ports: Record<string, string | null>;
  }[];
}

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
    score: number;
    rented: boolean;
  }[];
}

const getModelTrainerOptions = (type: "model" | "prompt" | "ssh") => {
  return {
    client_id: "me",
    image: "portraits/model-trainer:latest",
    env: {
      "-p 2222:22": "1",
    },
    disk: 60.0,
    runtype: type === "ssh" ? "ssh" : "args",
    args: ["-m", type === "model" ? "portraits.train" : "portraits.prompts"],

    image_login: `-u portraits -p ${env.DOCKER_IO_PASSWORD} docker.io`,
  };
};

export const vastRouter = router({
  activeInstances: adminProcedure.query(async () => {
    const response = await fetch(
      `https://vast.ai/api/v0/instances?owner=me&api_key=&api_key=${env.VAST_API_KEY}`
    );
    return (await response.json()) as ActiveInstancesResponse;
  }),
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
        type: z.enum(["model", "prompt", "ssh"]),
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
