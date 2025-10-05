import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { MoreDotIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

// Component for AQI Bar Chart (7-day variation)
function AQIChart() {
  const [aqiData, setAqiData] = useState([
    { date: "2025-09-29", aqi: 65 },
    { date: "2025-09-30", aqi: 72 },
    { date: "2025-10-01", aqi: 80 },
    { date: "2025-10-02", aqi: 85 },
    { date: "2025-10-03", aqi: 90 },
    { date: "2025-10-04", aqi: 88 },
    { date: "2025-10-05", aqi: 95 },
  ]);

  // Mock API call for AQI data
  const fetchAQIData = async () => {
    try {
      // Example: GET /airquality/stats/?type=aqi&range=7days
      // const response = await fetch("/airquality/stats/?type=aqi&range=7days");
      // const data = await response.json();
      // setAqiData(data);

      // Mock data
      const mockData = aqiData.map((item) => ({
        date: item.date,
        aqi: Math.floor(Math.random() * (100 - 50 + 1)) + 50, // Random AQI between 50-100
      }));
      setAqiData(mockData);
    } catch (error) {
      console.error("Error fetching AQI data:", error);
    }
  };

  useEffect(() => {
    fetchAQIData();
  }, []);

  const options: ApexOptions = {
    colors: ["#00E400", "#FFFF00", "#FF7E00", "#FF0000"], // AQI color coding
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 310,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
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
      type: "datetime",
      categories: aqiData.map((data) => data.date),
      labels: {
        format: "dd MMM",
        style: {
          fontSize: "12px",
        },
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
      max: 150, // AQI range for display
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
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
      x: {
        format: "dd MMM yyyy",
      },
      y: {
        formatter: (val: number) => `AQI: ${val}`,
      },
    },
    responsive: [
      {
        breakpoint: 640, // sm
        options: {
          chart: {
            height: 250, // Smaller height for mobile
          },
          xaxis: {
            labels: {
              style: {
                fontSize: "10px", // Smaller font for mobile
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "10px",
              },
            },
          },
        },
      },
    ],
  };

  const series = [
    {
      name: "AQI",
      data: aqiData.map((data) => data.aqi),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-4 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pb-5 sm:pt-5">
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:justify-between sm:gap-5 sm:mb-6">
        <div className="w-full">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            AQI Trends (Last 7 Days)
          </h3>
          <p className="mt-1 text-gray-500 text-xs dark:text-gray-400 sm:text-sm">
            Daily Air Quality Index variation
          </p>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[300px] sm:min-w-[500px] xl:min-w-full">
          <Chart options={options} series={series} type="bar" height={310} />
        </div>
      </div>
    </div>
  );
}

// Component for Pollutant Line Chart
function PollutantTrendChart() {
  const [pollutant, setPollutant] = useState("PM2.5");
  const [timeRange, setTimeRange] = useState("7days");
  const [pollutantData, setPollutantData] = useState([
    { date: "2025-09-29", concentration: 35 },
    { date: "2025-09-30", concentration: 40 },
    { date: "2025-10-01", concentration: 45 },
    { date: "2025-10-02", concentration: 50 },
    { date: "2025-10-03", concentration: 48 },
    { date: "2025-10-04", concentration: 55 },
    { date: "2025-10-05", concentration: 60 },
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mock API call for pollutant data
  const fetchPollutantData = async () => {
    try {
      // Example: GET /airquality/stats/?type=pollutant&pollutant=${pollutant}&range=${timeRange}
      // const response = await fetch(`/airquality/stats/?type=pollutant&pollutant=${pollutant}&range=${timeRange}`);
      // const data = await response.json();
      // setPollutantData(data);

      // Mock data
      const mockData = pollutantData.map((item) => ({
        date: item.date,
        concentration: Math.floor(Math.random() * (70 - 30 + 1)) + 30, // Random concentration between 30-70 µg/m³
      }));
      setPollutantData(mockData);
    } catch (error) {
      console.error("Error fetching pollutant data:", error);
    }
  };

  useEffect(() => {
    fetchPollutantData();
  }, [pollutant, timeRange]);

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 310,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
      y: {
        formatter: (val: number) => `${pollutant}: ${val} µg/m³`,
      },
    },
    xaxis: {
      type: "datetime",
      categories: pollutantData.map((data) => data.date),
      labels: {
        format: "dd MMM",
        style: {
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      title: {
        text: `${pollutant} (µg/m³)`,
        style: {
          fontFamily: "Outfit, sans-serif",
        },
      },
      min: 0,
      max: 100,
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
    },
    responsive: [
      {
        breakpoint: 640, // sm
        options: {
          chart: {
            height: 250, // Smaller height for mobile
          },
          xaxis: {
            labels: {
              style: {
                fontSize: "10px", // Smaller font for mobile
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "10px",
              },
            },
          },
        },
      },
    ],
  };

  const series = [
    {
      name: pollutant,
      data: pollutantData.map((data) => data.concentration),
    },
  ];

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handlePollutantChange = (newPollutant: string) => {
    setPollutant(newPollutant);
    closeDropdown();
  };

  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
    closeDropdown();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-4 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pb-5 sm:pt-5">
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:justify-between sm:gap-5 sm:mb-6">
        <div className="w-full">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            Pollutant Trends
          </h3>
          <p className="mt-1 text-gray-500 text-xs dark:text-gray-400 sm:text-sm">
            {pollutant} concentration over the last {timeRange === "7days" ? "7 days" : timeRange === "30days" ? "30 days" : "week"}
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown isOpen={isDropdownOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem
                onItemClick={() => handlePollutantChange("PM2.5")}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                PM2.5
              </DropdownItem>
              <DropdownItem
                onItemClick={() => handlePollutantChange("PM10")}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                PM10
              </DropdownItem>
              <DropdownItem
                onItemClick={() => handlePollutantChange("CO₂")}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                CO₂
              </DropdownItem>
              <DropdownItem
                onItemClick={() => handleTimeRangeChange("7days")}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Last 7 Days
              </DropdownItem>
              <DropdownItem
                onItemClick={() => handleTimeRangeChange("30days")}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Last 30 Days
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[300px] sm:min-w-[500px] xl:min-w-full">
          <Chart options={options} series={series} type="line" height={310} />
        </div>
      </div>
    </div>
  );
}

// Main component to render both charts
export default function AirQualityTrends() {
  return (
    <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:gap-6">
      <AQIChart />
      <PollutantTrendChart />
    </div>
  );
}