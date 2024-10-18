
// Import axios to make our http requests to the OpenWeatherMap API
import axios from 'axios';
import dayjs from 'dayjs';
// TODO: Complete the WeatherService class
class WeatherService {
  // Define the baseURL and API key properties
  baseURL: string;
  apiKey: string;

  constructor() {
    // TODO: Assign the properties baseURL and apiKey using process.env
    this.baseURL = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.OPENWEATHER_API_KEY || '6c8e9197dea363a51d7bc49a8d9e59c0'; 
  }

  // TODO: Create fetchLocationData method
  async getForecastWeatherForCity(city: string) {
    // Create the url variable using this.baseURL + '/forecast', a query parameter of 'units' set to imperial, a query parameter of 'q' set to the city parameter above and a query parameter of appid set to this.apiKey
    const url = `${this.baseURL}/forecast?units=imperial&q=${city}&appid=${this.apiKey}`;

    try {
      // Make a fetch request to OpenWeatherMap using the url above constructed above
      const res = await axios.get(url);

      // Please console.log res.data so you can see how the returned data is structured - The 5 day forecast will be provided to you in an array of 40 objects. Each object represents a 3-hour segment of time. 
      console.log(res.data);

      // Ensure res.data.list is defined before filtering
      if (!res.data.list) {
        throw new Error('Invalid response structure: list is undefined');
      }

      // BONUS: filter the array of 40 objects down to just objects that have a dt_txt that includes '12:00'
      const filteredForecast = res.data.list.filter((item: any) =>
        item.dt_txt.includes('12:00')
      );
      return filteredForecast;

    } catch (error) {
      console.error('Error fetching forecast weather data:', error);
      throw error; // Re-throw error to handle it outside this method if needed
    }
  }

  // TODO: Complete getCurrentWeatherForCity method
  async getCurrentWeatherForCity(city: string) {
    // Create the url variable using this.baseURL + '/weather', a query parameter of 'units' set to imperial, a query parameter of 'q' set to the city parameter above and a query parameter of appid set to this.apiKey
    const url = `${this.baseURL}/weather?units=imperial&q=${city}&appid=${this.apiKey}`;

    try {
      // Make a fetch request to OpenWeatherMap using the url constructed above
      const res = await axios.get(url);

      // Create a data object from the weather data you receive
      const data = {
        city: res.data.name, // this is completed for you as an example
        date: dayjs(res.data.dt * 1000).format('MM/DD/YYYY'), // Use the already installed dayjs package to convert res.data.dt * 1000 into a formatted date like '10/17/2024'
        icon: `http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`,
        iconDescription: res.data.weather[0].description,
        tempF: res.data.main.temp,
        windSpeed: res.data.wind.speed, 
        humidity: res.data.main.humidity
      };

      // Return the custom data object of weather information
      return data;
    } catch (error) {
      console.error('Error fetching current weather data:', error);
      throw error; // Re-throw error to handle it outside this method if needed
    }
  }
}
// Export a constructed/instatiated object, using our WeatherService class above
export default new WeatherService();

