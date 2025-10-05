// Define the TypeScript interface for AQI data
export interface AQIData {
  id: number;
  aqi: number;
  status: string;
  mainPollutant: string;
  healthMessage: string;
}

// Define the TypeScript interface for alerts (for AirQualityAlerts compatibility)
export interface Alert {
  id: number;
  title: string;
  message: string;
  severity: "low" | "moderate" | "high";
  read: boolean;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Mock data for AQI (used when API is not ready or returns empty response)
const initialAQI: AQIData = {
  id: 1,
  aqi: 75,
  status: "Moderate",
  mainPollutant: "PM2.5",
  healthMessage: "Air quality is acceptable, but some pollutants may be a concern for sensitive groups.",
};

// Mock data for alerts (for AirQualityAlerts compatibility)
const initialAlerts: Alert[] = [
  {
    id: 1,
    title: "High PM2.5 Levels",
    message: "PM2.5 levels in Douala are unhealthy for sensitive groups.",
    severity: "high",
    read: false,
  },
  {
    id: 2,
    title: "Ozone Alert",
    message: "Ozone levels expected to rise this afternoon.",
    severity: "moderate",
    read: false,
  },
];

// Fetch current AQI data from API
export const fetchCurrentAQI = async (): Promise<{ aqiData: AQIData | null; isUsingDummyData: boolean }> => {
  try {
    // Try GET /airquality/
    let response = await fetch(`${BASE_URL}/airquality/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed, e.g., "Authorization": "Bearer <token>"
      },
    });
    let data = await response.json();

    if (!response.ok) throw new Error("Failed to fetch from /airquality/");

    // If /airquality/ returns empty or invalid data, try /airquality/recent/
    if (!data || (Array.isArray(data) && data.length === 0)) {
      response = await fetch(`${BASE_URL}/airquality/recent/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      data = await response.json();

      if (!response.ok) throw new Error("Failed to fetch from /airquality/recent/");
    }

    // If data is still empty, use mock data
    if (!data || (Array.isArray(data) && data.length === 0)) {
      const mockAQI = Math.floor(Math.random() * (150 - 50 + 1)) + 50; // Random AQI between 50-150
      const pollutants = ["PM2.5", "NO₂", "O₃"];
      const mockPollutant = pollutants[Math.floor(Math.random() * pollutants.length)];
      const aqiInfo = getAQIInfo(mockAQI);
      return {
        aqiData: {
          id: Math.floor(Math.random() * 1000) + 1, // Generate random ID for mock data
          aqi: mockAQI,
          status: aqiInfo.status,
          mainPollutant: mockPollutant,
          healthMessage: aqiInfo.message,
        },
        isUsingDummyData: true,
      };
    }

    // Map API data to AQIData interface (adjust based on actual API response)
    const aqiData: AQIData = Array.isArray(data)
      ? {
          id: data[0]?.id || 1, // Use first record's ID or fallback
          aqi: data[0]?.aqi || 0,
          status: getAQIInfo(data[0]?.aqi || 0).status,
          mainPollutant: data[0]?.mainPollutant || "PM2.5",
          healthMessage: getAQIInfo(data[0]?.aqi || 0).message,
        }
      : {
          id: data.id || 1, // Use record's ID or fallback
          aqi: data.aqi || 0,
          status: getAQIInfo(data.aqi || 0).status,
          mainPollutant: data.mainPollutant || "PM2.5",
          healthMessage: getAQIInfo(data.aqi || 0).message,
        };

    return { aqiData, isUsingDummyData: false };
  } catch (error) {
    console.error("Error fetching AQI data:", error);
    // Fallback to mock data
    const mockAQI = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
    const pollutants = ["PM2.5", "NO₂", "O₃"];
    const mockPollutant = pollutants[Math.floor(Math.random() * pollutants.length)];
    const aqiInfo = getAQIInfo(mockAQI);
    return {
      aqiData: {
        id: Math.floor(Math.random() * 1000) + 1, // Generate random ID for mock data
        aqi: mockAQI,
        status: aqiInfo.status,
        mainPollutant: mockPollutant,
        healthMessage: aqiInfo.message,
      },
      isUsingDummyData: true,
    };
  }
};

// Helper function to determine AQI status and message (used in mock data)
const getAQIInfo = (aqi: number) => {
  if (aqi <= 50) return { color: "#00E400", status: "Good", message: "Air quality is satisfactory, with little or no risk." };
  if (aqi <= 100) return { color: "#FFFF00", status: "Moderate", message: "Air quality is acceptable, but some pollutants may be a concern for sensitive groups." };
  if (aqi <= 150) return { color: "#FF7E00", status: "Unhealthy for Sensitive Groups", message: "Sensitive groups may experience health effects." };
  if (aqi <= 200) return { color: "#FF0000", status: "Unhealthy", message: "Everyone may begin to experience health effects." };
  if (aqi <= 300) return { color: "#8F3F97", status: "Very Unhealthy", message: "Health alert: everyone may experience more serious health effects." };
  return { color: "#7E0023", status: "Hazardous", message: "Health warning: emergency conditions." };
};

// Delete an air quality record
export const deleteAirQualityRecord = async (id: number): Promise<boolean> => {
  try {
    // Simulate DELETE /airquality/{id}/
    // const response = await fetch(`/airquality/${id}/`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //     // Add authorization header if needed
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to delete air quality record");
    // return true;

    // Mock response for now
    return true;
  } catch (error) {
    console.error("Error deleting air quality record:", error);
    return false;
  }
};

// Fetch alerts (for AirQualityAlerts compatibility)
export const fetchAlerts = async (): Promise<{ alerts: Alert[]; isUsingDummyData: boolean }> => {
  try {
    let response = await fetch(`${BASE_URL}/airquality/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();

    if (!response.ok) throw new Error("Failed to fetch from /airquality/");

    if (!data || data.length === 0) {
      response = await fetch(`${BASE_URL}/airquality/recent/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      data = await response.json();

      if (!response.ok) throw new Error("Failed to fetch from /airquality/recent/");
    }

    if (!data || data.length === 0) {
      const mockData = initialAlerts.map((alert) => ({
        ...alert,
        severity: ["low", "moderate", "high"][Math.floor(Math.random() * 3)] as "low" | "moderate" | "high",
      }));
      return { alerts: mockData, isUsingDummyData: true };
    }

    return { alerts: data, isUsingDummyData: false };
  } catch (error) {
    console.error("Error fetching alerts:", error);
    const mockData = initialAlerts.map((alert) => ({
      ...alert,
      severity: ["low", "moderate", "high"][Math.floor(Math.random() * 3)] as "low" | "moderate" | "high",
    }));
    return { alerts: mockData, isUsingDummyData: true };
  }
};

// Mark an alert as read (for AirQualityAlerts compatibility)
export const markAlertAsRead = async (id: number): Promise<Alert | null> => {
  try {
    // Simulate PATCH /airquality/{id}/
    // const response = await fetch(`/airquality/${id}/`, {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ read: true }),
    // });
    // if (!response.ok) throw new Error("Failed to update read status");
    // const updatedAlert = await response.json();
    // return updatedAlert;

    return { id, title: "", message: "", severity: "low", read: true };
  } catch (error) {
    console.error("Error marking alert as read:", error);
    return null;
  }
};