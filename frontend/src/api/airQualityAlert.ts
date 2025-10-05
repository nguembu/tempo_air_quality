// Define the TypeScript interface for alerts
export interface Alert {
  id: number;
  title: string;
  message: string;
  severity: "low" | "moderate" | "high";
  read: boolean;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Mock data for alerts
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

// Fetch alerts from API
export const fetchAlerts = async (): Promise<{ alerts: Alert[]; isUsingDummyData: boolean }> => {
  try {
    // Try GET /alerts/
    let response = await fetch( `${BASE_URL}/alerts/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed, e.g., "Authorization": "Bearer <token>"
      },
    });
    let data = await response.json();

    if (!response.ok) throw new Error("Failed to fetch from /alerts/");

    // If data is empty, use mock data
    if (!data || data.length === 0) {
      const mockData = initialAlerts.map((alert) => ({
        ...alert,
        severity: ["low", "moderate", "high"][Math.floor(Math.random() * 3)] as "low" | "moderate" | "high",
      }));
      return { alerts: mockData, isUsingDummyData: true };
    }

    // Map API data to Alert interface (adjust based on actual API response)
    const alerts: Alert[] = Array.isArray(data)
      ? data.map((item: any) => ({
          id: item.id || 0,
          title: item.title || "Unknown Alert",
          message: item.message || "No message provided",
          severity: item.severity || "low",
          read: item.read || false,
        }))
      : [
          {
            id: data.id || 0,
            title: data.title || "Unknown Alert",
            message: data.message || "No message provided",
            severity: data.severity || "low",
            read: data.read || false,
          },
        ];

    return { alerts, isUsingDummyData: false };
  } catch (error) {
    console.error("Error fetching alerts:", error);
    const mockData = initialAlerts.map((alert) => ({
      ...alert,
      severity: ["low", "moderate", "high"][Math.floor(Math.random() * 3)] as "low" | "moderate" | "high",
    }));
    return { alerts: mockData, isUsingDummyData: true };
  }
};

// Mark an alert as read
export const markAlertAsRead = async (id: number): Promise<Alert | null> => {
  try {
    // Try POST /alerts/{id}/mark_read/
    let response = await fetch(`${BASE_URL}/alerts/${id}/mark_read/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed
      },
      body: JSON.stringify({ read: true }),
    });

    if (!response.ok) {
      // Fallback to PATCH /alerts/{id}/
      response = await fetch(`${BASE_URL}/alerts/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      });
      if (!response.ok) throw new Error("Failed to update read status");
    }

    const updatedAlert = await response.json();
    return {
      id: updatedAlert.id || id,
      title: updatedAlert.title || "",
      message: updatedAlert.message || "",
      severity: updatedAlert.severity || "low",
      read: updatedAlert.read || true,
    };
  } catch (error) {
    console.error("Error marking alert as read:", error);
    // Mock response for now
    return { id, title: "", message: "", severity: "low", read: true };
  }
};

// Delete an alert
export const deleteAlert = async (id: number): Promise<boolean> => {
  try {
    // Simulate DELETE /alerts/{id}/
    // const response = await fetch(`/alerts/${id}/`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to delete alert");
    // return true;

    return true;
  } catch (error) {
    console.error("Error deleting alert:", error);
    return false;
  }
};