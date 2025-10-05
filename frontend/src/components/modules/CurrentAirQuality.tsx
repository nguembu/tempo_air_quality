import { useState, useEffect } from "react";
import { MoreDotIcon, AlertHexaIcon, InfoIcon, ErrorHexaIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { fetchCurrentAQI, AQIData, deleteAirQualityRecord } from "../../api/airQualityApi";

export default function CurrentAirQuality() {
  // State for AQI data and dummy data flag
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [isUsingDummyData, setIsUsingDummyData] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch AQI data on mount and refresh every 5 minutes
  useEffect(() => {
    const loadAQI = async () => {
      const { aqiData: fetchedAQI, isUsingDummyData } = await fetchCurrentAQI();
      setAqiData(fetchedAQI);
      setIsUsingDummyData(isUsingDummyData);
    };
    loadAQI();
    const interval = setInterval(loadAQI, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // AQI color coding and status (moved to airQualityApi.ts for mock data)
  const getAQIInfo = (aqi: number) => {
    if (aqi <= 50) return { color: "#00E400", status: "Good", message: "Air quality is satisfactory, with little or no risk." };
    if (aqi <= 100) return { color: "#FFFF00", status: "Moderate", message: "Air quality is acceptable, but some pollutants may be a concern for sensitive groups." };
    if (aqi <= 150) return { color: "#FF7E00", status: "Unhealthy for Sensitive Groups", message: "Sensitive groups may experience health effects." };
    if (aqi <= 200) return { color: "#FF0000", status: "Unhealthy", message: "Everyone may begin to experience health effects." };
    if (aqi <= 300) return { color: "#8F3F97", status: "Very Unhealthy", message: "Health alert: everyone may experience more serious health effects." };
    return { color: "#7E0023", status: "Hazardous", message: "Health warning: emergency conditions." };
  };

  // Pollutant icon mapping
  const getPollutantIcon = (pollutant: string) => {
    switch (pollutant) {
      case "PM2.5": return <AlertHexaIcon className="text-gray-800 size-6 dark:text-white/90" />;
      case "NO₂": return <InfoIcon className="text-gray-800 size-6 dark:text-white/90" />;
      case "O₃": return <ErrorHexaIcon className="text-gray-800 size-6 dark:text-white/90" />;
      default: return <AlertHexaIcon className="text-gray-800 size-6 dark:text-white/90" />;
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Current Air Quality
            </h3>
            {isUsingDummyData && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Using dummy data (API not available)
              </p>
            )}
            {aqiData && (
              <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                <span className="text-black font-bold">Status:</span> {aqiData.status}
              </p>
            )}
          </div>
          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem
                onItemClick={async () => {
                  const { aqiData: fetchedAQI, isUsingDummyData } = await fetchCurrentAQI();
                  setAqiData(fetchedAQI);
                  setIsUsingDummyData(isUsingDummyData);
                  closeDropdown();
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Refresh
              </DropdownItem>
              <DropdownItem
                onItemClick={async () => {
                  // Placeholder for DELETE /airquality/{id}/ (e.g., clear current record)
                  if (aqiData?.id) {
                    const success = await deleteAirQualityRecord(aqiData.id);
                    if (success) {
                      setAqiData(null); // Clear data after deletion
                    }
                  }
                  closeDropdown();
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Clear Data
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        {aqiData ? (
          <>
            <p className="mt-4 w-full max-w-[380px] text-sm text-gray-500 sm:text-base">
              <span className="font-bold text-black">Health: </span> {aqiData.healthMessage}
            </p>
            {/* Large AQI Display */}
            <div className="mt-6 flex justify-center">
              <div className="text-center">
                <h2
                  className="text-5xl font-bold sm:text-6xl"
                  style={{ color: getAQIInfo(aqiData.aqi).color }}
                >
                  {aqiData.aqi}
                </h2>
                <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                  AQI
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            No air quality data available
          </p>
        )}
      </div>
      {aqiData && (
        <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
          <div>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
              Main Pollutant
            </p>
            <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
              {getPollutantIcon(aqiData.mainPollutant)}
              {aqiData.mainPollutant}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}