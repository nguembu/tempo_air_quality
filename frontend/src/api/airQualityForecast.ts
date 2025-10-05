// Define the TypeScript interface for forecast data
export interface ForecastData {
  id: number;
  timestamp: string;
  aqi: number;
  city: string;
}

// Mock data for forecasts
const initialForecasts: ForecastData[] = [
  { id: 1, timestamp: "2025-10-05T12:00Z", aqi: 72, city: "Douala" },
  { id: 2, timestamp: "2025-10-05T15:00Z", aqi: 85, city: "Douala" },
  { id: 3, timestamp: "2025-10-05T18:00Z", aqi: 95, city: "Douala" },
];

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Fetch forecast data from API for a given city
export const fetchForecast = async (city: string): Promise<{ forecasts: ForecastData[]; isUsingDummyData: boolean }> => {
  try {
    // Try GET /predictions/?city=<city>
    let response = await fetch(`${BASE_URL}/predictions/?city=${encodeURIComponent(city)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed, e.g., "Authorization": "Bearer <token>"
      },
    });
    let data = await response.json();

    if (!response.ok) throw new Error(`Failed to fetch from /predictions/?city=${city}`);

    // If data is empty, use mock data
    if (!data || data.length === 0) {
      const mockData = initialForecasts.map((forecast) => ({
        ...forecast,
        aqi: Math.floor(Math.random() * 150),
        city,
      }));
      return { forecasts: mockData, isUsingDummyData: true };
    }

    // Map API data to ForecastData interface (adjust based on actual API response)
    const forecasts: ForecastData[] = Array.isArray(data)
      ? data.map((item: any) => ({
          id: item.id || 0,
          timestamp: item.timestamp || new Date().toISOString(),
          aqi: item.aqi || 0,
          city: item.city || city,
        }))
      : [
          {
            id: data.id || 0,
            timestamp: data.timestamp || new Date().toISOString(),
            aqi: data.aqi || 0,
            city: data.city || city,
          },
        ];

    return { forecasts, isUsingDummyData: false };
  } catch (error) {
    console.error(`Error fetching forecast for ${city}:`, error);
    const mockData = initialForecasts.map((forecast) => ({
      ...forecast,
      aqi: Math.floor(Math.random() * 150),
      city,
    }));
    return { forecasts: mockData, isUsingDummyData: true };
  }
};

// Delete a forecast
export const deleteForecast = async (id: number): Promise<boolean> => {
  try {
    // Simulate DELETE /predictions/{id}/
    // const response = await fetch(`/predictions/${id}/`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // if (!response.ok) throw new Error(`Failed to delete forecast ${id}`);
    // return true;

    return true;
  } catch (error) {
    console.error(`Error deleting forecast ${id}:`, error);
    return false;
  }
};