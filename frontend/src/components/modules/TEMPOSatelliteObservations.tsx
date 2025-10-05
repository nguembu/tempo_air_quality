import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState, useEffect } from "react";
import { fetchObservations, deleteObservation, PollutantData } from "../../api/satelliteObservation";

export default function TEMPOSatelliteObservations() {
  // State for pollutant data, region, last update, dropdown, and dummy data flag
  const [pollutantData, setPollutantData] = useState<PollutantData[]>([]);
  const [region, setRegion] = useState("North America");
  const [lastUpdate, setLastUpdate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isUsingDummyData, setIsUsingDummyData] = useState(false);

  // Color coding based on concentration levels
  const getConcentrationColor = (concentration: number) => {
    if (concentration <= 50) return "#00E400"; // Low
    if (concentration <= 100) return "#FFFF00"; // Moderate
    return "#FF0000"; // High
  };

  // Full pollutant names for tooltips
  const getPollutantName = (pollutant: string) => {
    switch (pollutant) {
      case "NO₂":
        return "Nitrogen Dioxide";
      case "HCHO":
        return "Formaldehyde";
      case "Aerosol":
        return "Aerosol Index";
      case "PM₂.₅":
        return "Particulate Matter (2.5 µm)";
      default:
        return pollutant;
    }
  };

  // Handle region input and data fetch
  const handleRegionSubmit = async () => {
    const { observations, isUsingDummyData, lastUpdate } = await fetchObservations(region);
    setPollutantData(observations);
    setIsUsingDummyData(isUsingDummyData);
    setLastUpdate(lastUpdate);
  };

  // Clear observation data
  const clearObservations = async () => {
    try {
      // Attempt to delete each observation via API
      for (const observation of pollutantData) {
        const success = await deleteObservation(observation.id);
        if (!success) throw new Error(`Failed to delete observation ${observation.id}`);
      }
      setPollutantData([]);
      setIsUsingDummyData(false);
      setLastUpdate("");
    } catch (error) {
      console.error("Error clearing observations:", error);
      // Fallback to clearing local state
      setPollutantData([]);
      setIsUsingDummyData(false);
      setLastUpdate("");
    }
  };

  // Initial fetch for default region
  useEffect(() => {
    handleRegionSubmit();
  }, []);

  // Chart options for ApexCharts
  const options: ApexOptions = {
    colors: pollutantData.map((data) => getConcentrationColor(data.concentration)),
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: pollutantData.map((data) => data.pollutant),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    yaxis: {
      title: {
        text: "Concentration (µg/m³)",
        style: {
          fontFamily: "Outfit, sans-serif",
        },
      },
      min: 0,
      max: 200,
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number, { dataPointIndex }) => {
          const data = pollutantData[dataPointIndex];
          return `${getPollutantName(data.pollutant)}: ${val} µg/m³\nTimestamp: ${new Date(data.timestamp).toLocaleTimeString("en-US", {
            timeZone: "Africa/Lagos",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })} WAT`;
        },
      },
    },
  };

  const series = [
    {
      name: "Concentration",
      data: pollutantData.map((data) => data.concentration),
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
            TEMPO Satellite Air Quality Metrics
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
                await handleRegionSubmit();
                closeDropdown();
              }}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Refresh
            </DropdownItem>
            <DropdownItem
              onItemClick={async () => {
                await clearObservations();
                closeDropdown();
              }}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Clear Observations
            </DropdownItem>
          </Dropdown>
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

      {/* Chart or No Data Message */}
      {pollutantData.length === 0 ? (
        <p className="text-gray-500 text-theme-sm dark:text-gray-400 text-center">
          No observation data available
        </p>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
            <Chart options={options} series={series} type="bar" height={180} />
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#00E400]"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Low (0-50 µg/m³)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#FFFF00]"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Moderate (51-100 µg/m³)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#FF0000]"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">High (100 µg/m³)</span>
        </div>
      </div>

      {/* Source Info */}
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        🔹 Source: NASA TEMPO Satellite (Near-Real-Time)
      </p>
    </div>
  );
}