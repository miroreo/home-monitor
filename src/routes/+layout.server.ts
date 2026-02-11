import type { LayoutServerLoad } from "./$types";
import type { StatusData } from "./api/status/+server";
import type { WeatherData } from "./api/weather/+server";

export const load: LayoutServerLoad = async ({fetch}) => {
    const statusResp = await fetch("/api/status");
    const status = await statusResp.json() as StatusData;
    const weatherResp = await fetch("/api/weather");
    const weather = await weatherResp.json() as WeatherData;
    return {
        status,
        weather
    };
}