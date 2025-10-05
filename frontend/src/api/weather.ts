// Define the TypeScript interface for weather data
export interface WeatherData {
  id: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  region: string;
  timestamp: string;
}

// Mock data for weather
const initialWeather: WeatherData[] = [
  {
    id: 1,
    temperature: 26,
    humidity: 68,
    windSpeed: 3.2,
    precipitation: 1.2,
    region: "Douala",
    timestamp: "2025-10-05T19:10Z",
  },
];

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';


// Fetch weather data from API for a given region
export const fetchWeather = async (region: string): Promise<{ weather: WeatherData | null; isUsingDummyData: boolean; lastUpdate: string }> => {
  try {
    // Try GET /weather/?region=<region>
    let response = await fetch(`${BASE_URL}/weather/?region=${encodeURIComponent(region)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed, e.g., "Authorization": "Bearer <token>"
      },
    });
    let data = await response.json();

    if (!response.ok) throw new Error(`Failed to fetch from /weather/?region=${region}`);

    // If data is empty, use mock data
    if (!data || data.length === 0) {
      const mockData = {
        ...initialWeather[0],
        temperature: Math.floor(Math.random() * (35 - 15 + 1)) + 15,
        humidity: Math.floor(Math.random() * (80 - 50 + 1)) + 50,
        windSpeed: Number((Math.random() * (5 - 1) + 1).toFixed(1)),
        precipitation: Number((Math.random() * 5).toFixed(1)),
        region,
        timestamp: new Date().toISOString(),
      };
      const lastUpdate = new Date().toLocaleTimeString("en-US", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + " WAT";
      return { weather: mockData, isUsingDummyData: true, lastUpdate };
    }

    // Map API data to WeatherData interface (expecting a single record for simplicity)
    const weather: WeatherData = Array.isArray(data)
      ? {
          id: data[0].id || 0,
          temperature: data[0].temperature || 0,
          humidity: data[0].humidity || 0,
          windSpeed: data[0].windSpeed || 0,
          precipitation: data[0].precipitation || 0,
          region: data[0].region || region,
          timestamp: data[0].timestamp || new Date().toISOString(),
        }
      : {
          id: data.id || 0,
          temperature: data.temperature || 0,
          humidity: data.humidity || 0,
          windSpeed: data.windSpeed || 0,
          precipitation: data.precipitation || 0,
          region: data.region || region,
          timestamp: data.timestamp || new Date().toISOString(),
        };

    // Format lastUpdate as HH:mm WAT
    const lastUpdate = new Date(weather.timestamp).toLocaleTimeString("en-US", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " WAT";

    return { weather, isUsingDummyData: false, lastUpdate };
  } catch (error) {
    console.error(`Error fetching weather for ${region}:`, error);
    const mockData = {
      ...initialWeather[0],
      temperature: Math.floor(Math.random() * (35 - 15 + 1)) + 15,
      humidity: Math.floor(Math.random() * (80 - 50 + 1)) + 50,
      windSpeed: Number((Math.random() * (5 - 1) + 1).toFixed(1)),
      precipitation: Number((Math.random() * 5).toFixed(1)),
      region,
      timestamp: new Date().toISOString(),
    };
    const lastUpdate = new Date().toLocaleTimeString("en-US", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " WAT";
    return { weather: mockData, isUsingDummyData: true, lastUpdate };
  }
};

// Delete a weather record
export const deleteWeather = async (id: number): Promise<boolean> => {
  try {
    // Simulate DELETE /weather/{id}/
    // const response = await fetch(`/weather/${id}/`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // if (!response.ok) throw new Error(`Failed to delete weather ${id}`);
    // return true;

    return true;
  } catch (error) {
    console.error(`Error deleting weather ${id}:`, error);
    return false;
  }
};