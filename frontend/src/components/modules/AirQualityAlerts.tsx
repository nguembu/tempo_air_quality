import { useState, useEffect } from "react";
import { AlertHexaIcon, MoreDotIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import Badge from "../ui/badge/Badge";
import { fetchAlerts, markAlertAsRead, deleteAlert, Alert } from "../../api/airQualityAlert";

export default function AirQualityAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUsingDummyData, setIsUsingDummyData] = useState(false);

  // Fetch alerts on mount
  useEffect(() => {
    const loadAlerts = async () => {
      const { alerts: fetchedAlerts, isUsingDummyData } = await fetchAlerts();
      setAlerts(fetchedAlerts);
      setIsUsingDummyData(isUsingDummyData);
    };
    loadAlerts();
  }, []);

  // Mark an alert as read
  const handleMarkAsRead = async (id: number) => {
    const updatedAlert = await markAlertAsRead(id);
    if (updatedAlert) {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id ? { ...alert, read: true } : alert
        )
      );
    }
  };

  // Clear all alerts
  const clearAllAlerts = async () => {
    try {
      // Attempt to delete each alert via API
      for (const alert of alerts) {
        const success = await deleteAlert(alert.id);
        if (!success) throw new Error(`Failed to delete alert ${alert.id}`);
      }
      setAlerts([]);
      setIsUsingDummyData(false);
    } catch (error) {
      console.error("Error clearing alerts:", error);
      // Fallback to clearing local state
      setAlerts([]);
      setIsUsingDummyData(false);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  // Map severity to badge color
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "low":
        return "success"; // Yellow
      case "moderate":
        return "warning"; // Orange
      case "high":
        return "error"; // Red
      default:
        return "success";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Air Quality Alerts
          </h3>
          {isUsingDummyData && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Using dummy data (API not available)
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown isOpen={isDropdownOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem
                onItemClick={async () => {
                  const { alerts: fetchedAlerts, isUsingDummyData } = await fetchAlerts();
                  setAlerts(fetchedAlerts);
                  setIsUsingDummyData(isUsingDummyData);
                  closeDropdown();
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Refresh
              </DropdownItem>
              <DropdownItem
                onItemClick={async () => {
                  await clearAllAlerts();
                  closeDropdown();
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Clear All
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-theme-sm dark:text-gray-400 text-center">
            No active alerts
          </p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm"
            >
              <div className="flex items-start gap-3">
                <AlertHexaIcon className="text-gray-800 size-6 dark:text-white/90" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800 dark:text-white/90">
                      {alert.title} {alert.read ? "" : "(Unread)"}
                    </h4>
                    <Badge
                      size="sm"
                      color={getSeverityColor(alert.severity)}
                    >
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {alert.message}
                  </p>
                  {!alert.read && (
                    <button
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="mt-2 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-theme-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}