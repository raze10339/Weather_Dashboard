import { Router } from 'express';
const router = Router();
import historyService from '../../service/historyService.js';
import weatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    try {
        const { cityName } = req.body;
        if (!cityName) {
            return res.status(400).json({ error: 'City name is required' });
        }
        const currentData = await weatherService.getCurrentWeatherForCity(req.body.cityName);
        const forecastData = await weatherService.getForecastWeatherForCity(req.body.cityName);
        const weatherData = [currentData, forecastData];
        // Save city to search history
        await historyService.addCity(req.body.cityName);
        return res.json(weatherData);
    }
    catch (error) {
        console.error('Error retrieving weather data:', error);
        return res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
});
// TODO: GET search history
router.get('/history', async (_, res) => {
    try {
        const searchHistory = await historyService.getCities();
        res.json(searchHistory);
    }
    catch (error) {
        console.error('Error retrieving search history:', error);
        res.status(500).json({ error: 'Failed to retrieve search history' });
    }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    try {
        const cityId = req.params.id;
        if (!cityId) {
            return res.status(400).json({ error: 'City ID is required' });
        }
        await historyService.removeCity(cityId);
        return res.status(200).json({ message: 'City removed from search history' });
    }
    catch (error) {
        console.error('Error removing city from search history:', error);
        return res.status(500).json({ error: 'Error removing city from search history' });
    }
});
export default router;
