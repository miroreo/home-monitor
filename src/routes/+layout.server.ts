import type { LayoutServerLoad } from "./$types";
import type { StatusData } from "./api/status/+server";

export const load: LayoutServerLoad = async ({fetch}) => {
    const statusResp = await fetch("/api/status");
    const status = await statusResp.json() as StatusData;
    return {
        status
    };
}