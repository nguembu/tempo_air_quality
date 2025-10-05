import { useState, useEffect } from "react";
import { BoltIcon, PageIcon, ArrowRightIcon, DocsIcon, MoreDotIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { fetchWeather, deleteWeather, WeatherData } from "../../api/weather";

export default function WeatherOverview() {
  // State for weather data, region, last update, dropdown, and dummy data flag
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [region, setRegion] = useState("Douala");
  const [lastUpdate, setLastUpdate] = useState("");
  const [isUsingDummyData, setIsUsingDummyData] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch weather data for the region
  const handleRegionSubmit = async () => {
    const { weather, isUsingDummyData, lastUpdate } = await fetchWeather(region);
    setWeatherData(weather);
    setIsUsingDummyData(isUsingDummyData);
    setLastUpdate(lastUpdate);
  };

  // Clear weather data
  const clearWeather = async () => {
    try {
      if (weatherData) {
        const success = await deleteWeather(weatherData.id);
        if (!success) throw new Error(`Failed to delete weather ${weatherData.id}`);
      }
      setWeatherData(null);
      setIsUsingDummyData(false);
      setLastUpdate("");
    } catch (error) {
      console.error("Error clearing weather:", error);
      // Fallback to clearing local state
      setWeatherData(null);
      setIsUsingDummyData(false);
      setLastUpdate("");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    handleRegionSubmit();
  }, []);

  // Dropdown toggle
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <div className="overflow-hidden rounded-2xl border pb-8 border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Weather Overview
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
                  await handleRegionSubmit();
                  closeDropdown();
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Refresh
              </DropdownItem>
              <DropdownItem
                onItemClick={async () => {
                  await clearWeather();
                  closeDropdown();
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Clear Weather
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Region input and last update */}
      <div className="my-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Enter region"
            className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:px-3 sm:py-2 sm:text-base sm:max-w-sm"
          />
          <button
            onClick={handleRegionSubmit}
            className="w-full rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 sm:w-auto sm:px-4 sm:py-2 sm:text-base"
          >
            Update
          </button>
        </div>
        {lastUpdate && (
          <span className="text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
            Last Update: {lastUpdate}
          </span>
        )}
      </div>

      {/* Weather Cards or No Data Message */}
      {weatherData ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
          {/* Temperature Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <BoltIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Temperature
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {weatherData.temperature}°C
              </h4>
            </div>
          </div>

          {/* Humidity Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <PageIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Humidity
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {weatherData.humidity}%
              </h4>
            </div>
          </div>

          {/* Wind Speed Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <ArrowRightIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Wind Speed
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {weatherData.windSpeed} m/s
              </h4>
            </div>
          </div>

          {/* Precipitation Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <DocsIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Precipitation
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {weatherData.precipitation} mm
              </h4>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-theme-sm dark:text-gray-400 text-center">
          No weather data available
        </p>
      )}
    </div>
  );
}