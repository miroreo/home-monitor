import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CTA, type Arrival } from '$lib/cta';
import { env } from '$env/dynamic/private';

import { fetchWeatherApi } from 'openmeteo';

export const GET: RequestHandler = async ({ request, url, setHeaders }) => {
    console.log(`GET ${url.pathname} UA: ${request.headers.get("User-Agent")}`)
    
    try {
        
        
        const hourPrice = await getCurrentHourPrice();
        
        setHeaders({ 'cache-control': 'public, max-age=600' });
        return json({
            timems: Date.now(),
            energy: {
                currentHourPrice: hourPrice.price
            },
            transit: {
                trainArrivals: await getArrivals()
            }
        } as StatusData)
    } catch (e) {
        return json({}, {status: 500});
    }
};
