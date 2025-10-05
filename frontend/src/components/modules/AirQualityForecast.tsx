import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState, useEffect } from "react";
import { fetchForecast, deleteForecast, ForecastData } from "../../api/airQualityForecast";

export default function AirQualityForecast() {
  // State for chart data, city input, dropdown, and dummy data flag
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [city, setCity] = useState("Douala");
  const [isOpen, setIsOpen] = useState(false);
  const [isUsingDummyData, setIsUsingDummyData] = useState(false);

  // AQI color coding based on health categories
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#00E400"; // Good
    if (aqi <= 100) return "#FFFF00"; // Moderate
    if (aqi <= 150) return "#FF7E00"; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return "#FF0000"; // Unhealthy
    if (aqi <= 300) return "#8F3F97"; // Very Unhealthy
    return "#7E0023"; // Hazardous
  };

  // AQI health category message
  const getAQIMessage = (aqi: number) => {
    if (aqi <= 50) return "Good air quality expected.";
    if (aqi <= 100) return "Moderate air quality expected.";
    if (aqi <= 150) return "Unhealthy for sensitive groups.";
    if (aqi <= 200) return "Unhealthy air quality expected.";
    if (aqi <= 300) return "Very unhealthy air quality expected.";
    return "Hazardous air quality expected.";
  };

  // Handle city input and forecast fetch
  const handleCitySubmit = async () => {
    const { forecasts, isUsingDummyData } = await fetchForecast(city);
    setForecastData(forecasts);
    setIsUsingDummyData(isUsingDummyData);
  };

  // Clear forecast data
  const clearForecast = async () => {
    try {
      // Attempt to delete each forecast via API
      for (const forecast of forecastData) {
        const success = await deleteForecast(forecast.id);
        if (!success) throw new Error(`Failed to delete forecast ${forecast.id}`);
      }
      setForecastData([]);
      setIsUsingDummyData(false);
    } catch (error) {
      console.error("Error clearing forecasts:", error);
      // Fallback to clearing local state
      setForecastData([]);
      setIsUsingDummyData(false);
    }
  };

  // Initial fetch for default city
  useEffect(() => {
    handleCitySubmit();
  }, []);

  // Chart options for ApexCharts
  const options: ApexOptions = {
    colors: [getAQIColor(forecastData[forecastData.length - 1]?.aqi || 50)],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      area: {
        fillTo: "origin",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: forecastData.map((data) => data.timestamp),
      labels: {
        format: "HH:mm",
        datetimeUTC: true,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "AQI",
        style: {
          fontFamily: "Outfit, sans-serif",
        },
      },
      min: 0,
      max: 300,
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 0.3,
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    tooltip: {
      x: {
        format: "HH:mm",
      },
      y: {
        formatter: (val: number) => `AQI: ${val}`,
      },
    },
  };

  const series = [
    {
      name: "AQI",
      data: forecastData.map((data) => data.aqi),
    },
  ];

  // Dropdown toggle
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Air Quality Forecast
          </h3>
          {isUsingDummyData && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Using dummy data (API not available)
            </p>
          )}
        </div>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View Details
            </DropdownItem>
            <DropdownItem
              onItemClick={async () => {
                await handleCitySubmit();
                closeDropdown();
              }}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Refresh
            </DropdownItem>
            <DropdownItem
              onItemClick={async () => {
                await clearForecast();
                closeDropdown();
              }}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Clear Forecast
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* City input and button */}
      <div className="my-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:px-3 sm:py-2 sm:text-base sm:max-w-sm"
        />
        <button
          onClick={handleCitySubmit}
          className="w-full rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 sm:w-auto sm:px-4 sm:py-2 sm:text-base"
        >
          Get Forecast
        </button>
      </div>

      {/* Chart or No Data Message */}
      {forecastData.length === 0 ? (
        <p className="text-gray-500 text-theme-sm dark:text-gray-400 text-center">
          No forecast data available
        </p>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
            <Chart options={options} series={series} type="area" height={180} />
          </div>
        </div>
      )}

      {/* AQI Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#00E400]"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Good (0-50)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#FFFF00]"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Moderate (51-100)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#FF7E00]"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Unhealthy for Sensitive Groups (101-150)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#FF0000]"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Unhealthy (151-200)</span>
        </div>
      </div>

      {/* AQI Message */}
      {forecastData.length > 0 && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          🔹 {getAQIMessage(forecastData[forecastData.length - 1].aqi)}
        </p>
      )}
    </div>
  );
}