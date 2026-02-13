<script lang="ts">
    import weatherCodesRaw from "$lib/wmoCodes.json";
	import { onMount } from "svelte";
	import type { CurrentWeatherData, WeatherData } from "../routes/api/weather/+server";
    
    let weatherCodes = weatherCodesRaw as {
        [key: string]: {
            "day": {
                description: string,
                image: string
            },
            "night": {
                description: string,
                image: string
            }
        }
    }
    export let currentWeather: CurrentWeatherData;
    let imageSrc = weatherCodes[currentWeather?.weather_code.toString()][currentWeather?.is_day ? "day" : "night"].image;
    let weatherDescription = weatherCodes[currentWeather.weather_code.toString()][currentWeather.is_day ? "day" : "night"].description;
</script>
<div class="h-full flex flex-col gap-y-2 text-center justify-center content-center">
    <img class="w-48" src={imageSrc} />
    <p class="text-xl">{weatherDescription}</p>
    <p class="text-7xl">{currentWeather.temperature_2m.toFixed(0)}<span class="text-3xl align-top">&deg;F</span></p>
    <p class="text-xl">Feels Like {currentWeather.apparent_temperature.toFixed(0)}<span class="text-sm align-top">&deg;F</span></p>
</div>
<p class="text-right italic text-sm">As of 
    {new Date(currentWeather.time).toLocaleTimeString(undefined, {
    timeStyle: "short"
})}</p>