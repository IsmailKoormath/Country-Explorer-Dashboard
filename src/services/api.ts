import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Country } from "../context/FavoritesContext";

/*  Constants  */
const BASE_URL = "https://restcountries.com/v3.1";
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "";
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

/* Types */

export interface WeatherData {
  weather: { main: string; description: string; icon: string }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  wind: { speed: number };
  name: string;
  [key: string]: unknown;
}

/*  API Functions */

export async function getAllCountries(): Promise<Country[]> {
  try {
    const response: AxiosResponse<Country[]> = await axios.get(
      `${BASE_URL}/all?fields=name,cca3,region,capital,population,flags
`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
}

export async function getCountryByCode(code: string): Promise<Country> {
  try {
    const response: AxiosResponse<Country[]> = await axios.get(
      `${BASE_URL}/alpha/${code}`
    );
    return response.data[0];
  } catch (error) {
    console.error("Error fetching country:", error);
    throw error;
  }
}

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  if (!WEATHER_API_KEY) {
    throw new Error("Weather API key not configured");
  }

  try {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${
        import.meta.env.VITE_WEATHER_API_KEY
      }&units=metric`
    )
      .then((res) => res.json())
      .then((data) => console.log(data));

    const response: AxiosResponse<WeatherData> = await axios.get(
      `${WEATHER_BASE_URL}/weather`,
      {
        params: {
          q: city,
          appid: WEATHER_API_KEY,
          units: "metric",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}
