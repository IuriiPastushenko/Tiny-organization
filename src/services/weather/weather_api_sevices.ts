// api weather forecast https://openweathermap.org/current

import axios from 'axios';
import { keysApiWeather } from './wf.constants';
import { IWeatherOutput } from './weather.interfaces';
import { IGetCoordinats } from '../services.interfaces';

// Connection api weather forecast
async function getWeather(
	inputData: IGetCoordinats,
	place: string,
): Promise<string | IWeatherOutput | undefined> {
	const latInput = inputData.lat;
	const lotInput = inputData.lon;
	const { data } = await axios.get(
		'https://api.openweathermap.org/data/2.5/weather',
		{
			params: {
				lat: latInput,
				lon: lotInput,
				appid: keysApiWeather.weatherToken,
				units: 'metric',
				lang: 'ua',
			},
		},
	);

	if (data && data.length !== 0) {
		// Output formatting
		const weatherOutput: IWeatherOutput = {
			data: new Date().toLocaleDateString(),
			firstname: inputData.firstname,
			lastname: inputData.lastname,
			jobplace: place,
			weatherOnStreet: data.weather[0].description,
			temperature: data.main.temp,
			windSpeed: data.wind.speed,
		};
		return weatherOutput;
	} else {
		throw Error('Error api openweathermap');
	}
}

export { getWeather };
