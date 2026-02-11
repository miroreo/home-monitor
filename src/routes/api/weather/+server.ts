import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CTA, type Arrival } from '$lib/cta';
import { env } from '$env/dynamic/private';

import { fetchWeatherApi } from 'openmeteo';

const [lat, lon] = env.WEATHER_LOCATION.split(",");

const OPEN_METEO_PARAMS = {
    latitude: [lat],
    longitude: [lon],
    daily: ["weather_code", "rain_sum", "temperature_2m_max", "temperature_2m_min"],
	hourly: ["temperature_2m", "precipitation", "precipitation_probability", "apparent_temperature", "weather_code"],
	current: ["temperature_2m", "precipitation", "weather_code", "wind_speed_10m", "wind_direction_10m", "apparent_temperature", "is_day"],
	timezone: "America/Chicago",
	temperature_unit: "fahrenheit",
};
	
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

export type CurrentWeatherData = {
    time: string,
    temperature_2m: number,
    precipitation: number,
    weather_code: number,
    wind_speed_10m: number,
    wind_direction_10m: number,
    apparent_temperature: number,
    is_day: false
  }
export type WeatherData = {
  current: CurrentWeatherData,
  hourly: {
    time: string[],
    temperature_2m: {[key: `${number}`]: number},
    precipitation: {[key: `${number}`]: number},
    precipitation_probability: {[key: `${number}`]: number},
    apparent_temperature: {[key: `${number}`]: number},
    weather_code: {[key: `${number}`]: number},
  },
  daily: {
    time: string[],
    weather_code: {[key: `${number}`]: number},
    rain_sum: {[key: `${number}`]: number},
    temperature_2m_max: {[key: `${number}`]: number},
    temperature_2m_min: {[key: `${number}`]: number},
  }
};
export const GET: RequestHandler = async ({ request, url, setHeaders }) => {
    console.log(`GET ${url.pathname} UA: ${request.headers.get("User-Agent")}`)
    const responses = await fetchWeatherApi(OPEN_METEO_URL, OPEN_METEO_PARAMS);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const latitude = response.latitude();
    const longitude = response.longitude();
    const elevation = response.elevation();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const utcOffsetSeconds = response.utcOffsetSeconds();


    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature_2m: current.variables(0)!.value(),
            precipitation: current.variables(1)!.value(),
            weather_code: current.variables(2)!.value(),
            wind_speed_10m: current.variables(3)!.value(),
            wind_direction_10m: current.variables(4)!.value(),
            apparent_temperature: current.variables(5)!.value(),
            is_day: current.variables(6)!.value() == 1,
        },
        hourly: {
            time: Array.from(
                { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() }, 
                (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature_2m: hourly.variables(0)!.valuesArray(),
            precipitation: hourly.variables(1)!.valuesArray(),
            precipitation_probability: hourly.variables(2)!.valuesArray(),
            apparent_temperature: hourly.variables(3)!.valuesArray(),
            weather_code: hourly.variables(4)!.valuesArray(),
        },
        daily: {
            time: Array.from(
                { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() }, 
                (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            weather_code: daily.variables(0)!.valuesArray(),
            rain_sum: daily.variables(1)!.valuesArray(),
            temperature_2m_max: daily.variables(2)!.valuesArray(),
            temperature_2m_min: daily.variables(3)!.valuesArray(),
        },
    };
        return json(weatherData);
    //     setHeaders({ 'cache-control': 'public, max-age=600' });
    //     return json({
    //         timems: Date.now(),
    //         energy: {
    //             currentHourPrice: hourPrice.price
    //         },
    //         transit: {
    //             trainArrivals: await getArrivals()
    //         }
    //     } as StatusData)
    // } catch (e) {
        return json({}, {status: 500});
    // }
};