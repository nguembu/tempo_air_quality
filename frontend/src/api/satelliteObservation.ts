// Define the TypeScript interface for TEMPO satellite observation data
export interface PollutantData {
  id: number;
  pollutant: string;
  concentration: number;
  timestamp: string;
  region: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';


// Mock data for TEMPO satellite observations
const initialObservations: PollutantData[] = [
  { id: 1, pollutant: "NO₂", concentration: 120, timestamp: "2025-10-05T10:30Z", region: "North America" },
  { id: 2, pollutant: "HCHO", concentration: 90, timestamp: "2025-10-05T10:30Z", region: "North America" },
  { id: 3, pollutant: "Aerosol", concentration: 45, timestamp: "2025-10-05T10:30Z", region: "North America" },
  { id: 4, pollutant: "PM₂.₅", concentration: 80, timestamp: "2025-10-05T10:30Z", region: "North America" },
];

// Fetch TEMPO satellite observations from API for a given region
export const fetchObservations = async (region: string): Promise<{ observations: PollutantData[]; isUsingDummyData: boolean; lastUpdate: string }> => {
  try {
    // Try GET /tempo/?region=<region>
    let response = await fetch(`${BASE_URL}/tempo/?region=${encodeURIComponent(region)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed, e.g., "Authorization": "Bearer <token>"
      },
    });
    let data = await response.json();

    if (!response.ok) throw new Error(`Failed to fetch from /tempo/?region=${region}`);

    // If data is empty, use mock data
    if (!data || data.length === 0) {
      const mockData = initialObservations.map((obs) => ({
        ...obs,
        concentration: Math.floor(Math.random() * 150),
        timestamp: new Date().toISOString(),
        region,
      }));
      const lastUpdate = new Date().toLocaleTimeString("en-US", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + " WAT";
      return { observations: mockData, isUsingDummyData: true, lastUpdate };
    }

    // Map API data to PollutantData interface (adjust based on actual API response)
    const observations: PollutantData[] = Array.isArray(data)
      ? data.map((item: any) => ({
          id: item.id || 0,
          pollutant: item.pollutant || "Unknown",
          concentration: item.concentration || 0,
          timestamp: item.timestamp || new Date().toISOString(),
          region: item.region || region,
        }))
      : [
          {
            id: data.id || 0,
            pollutant: data.pollutant || "Unknown",
            concentration: data.concentration || 0,
            timestamp: data.timestamp || new Date().toISOString(),
            region: data.region || region,
          },
        ];

    // Use the latest timestamp from the data or current time in WAT
    const lastUpdate = observations.length > 0
      ? new Date(observations[0].timestamp).toLocaleTimeString("en-US", {
          timeZone: "Africa/Lagos",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) + " WAT"
      : new Date().toLocaleTimeString("en-US", {
          timeZone: "Africa/Lagos",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) + " WAT";

    return { observations, isUsingDummyData: false, lastUpdate };
  } catch (error) {
    console.error(`Error fetching TEMPO observations for ${region}:`, error);
    const mockData = initialObservations.map((obs) => ({
      ...obs,
      concentration: Math.floor(Math.random() * 150),
      timestamp: new Date().toISOString(),
      region,
    }));
    const lastUpdate = new Date().toLocaleTimeString("en-US", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " WAT";
    return { observations: mockData, isUsingDummyData: true, lastUpdate };
  }
};

// Delete a TEMPO satellite observation
export const deleteObservation = async (id: number): Promise<boolean> => {
  try {
    // Simulate DELETE /tempo/{id}/
    // const response = await fetch(`/tempo/${id}/`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // if (!response.ok) throw new Error(`Failed to delete observation ${id}`);
    // return true;

    return true;
  } catch (error) {
    console.error(`Error deleting observation ${id}:`, error);
    return false;
  }
};