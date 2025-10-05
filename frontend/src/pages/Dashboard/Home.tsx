import WeatherOverview from "../../components/modules/WeatherOverview";
import AQIChart from "../../components/modules/AQIChart";
import AirQualityAlerts from "../../components/modules/AirQualityAlerts";
import PageMeta from "../../components/common/PageMeta";
import AirQualityForecast from "../../components/modules/AirQualityForecast";
import CurrentAirQuality from "../../components/modules/CurrentAirQuality";
import TEMPOSatelliteObservations from "../../components/modules/TEMPOSatelliteObservations";
export default function Home() {
  return (
    <>
      <PageMeta
        title="Breezly"
        description="Real-time air quality forecasts and alerts using NASA TEMPO and ground sensor data."
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">

        <div className="col-span-12 grid grid-cols-1 gap-4">
          <WeatherOverview />
        </div>

        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:gap-6">
           <CurrentAirQuality /> {/* Check */}
          <AirQualityAlerts /> {/* Check */}
        </div>

        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:gap-6">
          <AirQualityForecast /> {/* Check */}
          <TEMPOSatelliteObservations /> {/* Check */}
        </div>

        {/* <div className="col-span-12 grid grid-cols-2 gap-4">
          <AQIChart />
        </div> */}

        <div className="col-span-12 xl:col-span-12 text-end text-gray-400">
            © 2025 BreezTech. All rights reserved.
        </div>
      </div>
    </>
  );
}
