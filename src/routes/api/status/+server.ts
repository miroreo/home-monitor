import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

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

export type StatusData = {
    timems: number,
    energy: {
        currentHourPrice: number,
    }
}
export const GET: RequestHandler = async ({ request }) => {
    const hourPrice = await getCurrentHourPrice();
    return json({
        timems: Date.now(),
        energy: {
            currentHourPrice: hourPrice.price
        }
    } as StatusData)
};
