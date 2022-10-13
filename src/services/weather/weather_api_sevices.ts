// api weather forecast https://openweathermap.org/current

import axios from 'axios';
import { Logger } from '../../../main';
import { keysApiWeather } from './wf.constants';
import { IWeatherOutput } from './weather.interfaces';
import { IGetCoordinats } from '../../controllers/interfaces/services.interfaces';

// Connection api weather forecast
async function getWeather(
	inputData: IGetCoordinats,
	place: string,
): Promise<string | IWeatherOutput | undefined> {
	try {
		const latInput = inputData.lat;
		const lotInput = inputData.lon;

		const { data } = await axios.get(
			'https://api.openweathermap.org/data/2.5/weather',
			{
				params: {
					lat: +latInput,
					lon: +lotInput,
					appid: keysApiWeather.weatherToken,
					units: 'metric',
					lang: 'ua',
				},
			},
		);

		if (data && data.length !== 0) {
			// Оформление вывода
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
			return 'Error api openweathermap';
		}
	} catch (err: any) {
		Logger.error('Error api openweathermap: ', err.message);
		await Logger.write(Logger.dataForWrite);
	}
}

export { getWeather };
