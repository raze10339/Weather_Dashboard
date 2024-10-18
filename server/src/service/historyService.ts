import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
// TODO: Define a City class with name and id properties
class City {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }
}
// TODO: Complete the HistoryService class
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const historyFilePath = path.join(__dirname, '../../db/searchHistory.json');

class HistoryService {
  // Read the searchHistory.json file and return the array of cities
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(historyFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // File doesn't exist, create a new one with empty data
        await fs.writeFile(historyFilePath, '[]', 'utf-8');
        return [];
      } else {
        console.error('Error reading search history:', error);
        throw error;
      }
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(historyFilePath, JSON.stringify(cities, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing to search history:', error);
      throw error;
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  async getCities(): Promise<City[]> {
    return await this.read();
  
  }
  

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  async addCity(cityName: string): Promise<void> {
    const citiesArray = await this.getCities();
    const newCity = new City(cityName);

    // Check if the city already exists in the history
    if (!citiesArray.some(city => city.name.toLowerCase() === cityName.toLowerCase())) {
      citiesArray.push(newCity);
      await this.write(citiesArray);
    }
    console.log('City added');
  }
 
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  async removeCity(id: string): Promise<void> {
    const citiesArray = await this.getCities();
    const updatedCities = citiesArray.filter(city => city.id !== id);

    if (updatedCities.length !== citiesArray.length) {
      await this.write(updatedCities);
    }
  }
}

export default new HistoryService();
