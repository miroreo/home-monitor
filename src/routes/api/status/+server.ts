import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CTA, type Arrival, type BusArrival, type TransitAlert, type TransitArrival } from '$lib/cta';
import { env } from '$env/dynamic/private';

const COMED_CURRENT_HOUR = "https://hourlypricing.comed.com/api?type=currenthouraverage";
type ComEdCurrentHourPriceResponse = {
    millisUTC: `${number}`,
    price: `${number}`,
}[];

const getCurrentHourPrice = async (): Promise<{time: Date, price: number}> =>  {
    const resp = await fetch(COMED_CURRENT_HOUR);
    const data = await resp.json() as ComEdCurrentHourPriceResponse;
    return {
        time: new Date(data[0].millisUTC),
        price: parseFloat(data[0].price)
    };
};

const getArrivals = async (): Promise<TransitArrival[]> => {
    const stations: string[] = env.CTA_TRAIN_STATIONS?.split(",") || [] as string[];
    const cta = new CTA(env.CTA_TRAINTRACKER_KEY, env.CTA_BUSTRACKER_KEY);
    let arrivals: TransitArrival[] = [];
    for (const s of stations) {
        let sArr = await cta.trainTracker.getArrivals(parseInt(s));

        // console.log(sArr);
        arrivals.push(...sArr);
        // console.log(`${sArr.length}sarr ${arrivals.length}arr`)
    }
    // console.log(arrivals);
    // return arrivals.sort((a,b) => (new Date(a.arrivalTime).valueOf()) - (new Date(b.arrivalTime).valueOf()));
    return arrivals.slice(0,10);
}
const getBusArrivals = async (): Promise<TransitArrival[]> => {
    // console.log("getting bus arrivals");
    const stops: string[] = env.CTA_BUS_STOPS?.split(",") || [] as string[];
    if(stops.length == 0) return [];
    const cta = new CTA(env.CTA_TRAINTRACKER_KEY, env.CTA_BUSTRACKER_KEY);
    let arrivals: TransitArrival[] = [];
    for (const s of stops) {
        let sArr = await cta.busTracker.getPredictions(parseInt(s));
        if(!sArr) continue;
        if(Array.isArray(sArr)) arrivals.push(...sArr);
        else arrivals.push(sArr);
    }
    // console.log(arrivals);
    return arrivals.sort((a, b) => a.arrivalTime > b.arrivalTime ? 1 : -1).slice(0,10);
}
export type StatusData = {
    timems: number,
    energy: {
        currentHourPrice: number,
    },
    transit: {
        arrivals: TransitArrival[],
        alerts: TransitAlert[],
    }
}
export const GET: RequestHandler = async ({ request, url, setHeaders }) => {
    console.log(`GET ${url.pathname} UA: ${request.headers.get("User-Agent")}`)
    
    try {
        
        
        const hourPrice = await getCurrentHourPrice();
        
        setHeaders({ 'cache-control': 'public, max-age=10' });
        return json({
            timems: Date.now(),
            energy: {
                currentHourPrice: hourPrice.price
            },
            transit: {
                arrivals: (await getArrivals()).concat(await getBusArrivals()).sort((a,b) => a.arrivalTime > b.arrivalTime ? 1 : -1).slice(0,10),
                alerts: await CTA.getAlerts(),
            }
        } as StatusData)
    } catch (e) {
        console.error(e);
        return json({}, {status: 500});
    }
};
