import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";

const AppHeader: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const inputRef = useRef<HTMLInputElement>(null);

  // Update date/time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // 60,000 ms = 1 minute

    return () => clearInterval(interval);
  }, []);

  // Format the date
  const formattedDate = currentDate
    .toLocaleString("en-US", {
      month: "short", // "Oct"
      day: "numeric", // "5"
      year: "numeric", // "2025"
      hour: "numeric", // "4"
      minute: "2-digit", // "57"
      hour12: true, // AM/PM
    })
    .replace(",", " |"); // Insert the pipe

  // Handle Cmd/Ctrl + K to focus search input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);
  // const closeUserDropdown = () => setIsUserDropdownOpen(false);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        {/* App Name/Logo */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <Link to="/" className="flex items-center gap-2">
            {/* <img
              className="dark:hidden h-8"
              src="./images/logo/logo.svg"
              alt="Air Quality App"
            />*/}
            {/* <img
              className="hidden dark:block h-8"
              src="./images/logo/logo-dark.svg"
              alt="Air Quality App"
            />  */}
            <h2 className="text-2xl font-semibold dark:text-white">Breezly</h2>
          </Link>
        </div>

        {/* Location Search */}
        <div className="hidden lg:block">
          <form>
            <div className="relative">
              <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                <svg
                  className="fill-gray-500 dark:fill-gray-400"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                    fill=""
                  />
                </svg>
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for a City..."
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
              />
              <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                <span>Enter</span>
              </button>
            </div>
          </form>
        </div>

        {/* Date/Time, Theme Toggle, and User Dropdown */}
        <div className="flex items-center justify-between w-full gap-4 px-5 py-4 lg:justify-end lg:px-0">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formattedDate}
            </span>
            <ThemeToggleButton />
            {/* <div className="relative inline-block">
              <button className="dropdown-toggle" onClick={toggleUserDropdown}>
                <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
              </button>
              <Dropdown
                isOpen={isUserDropdownOpen}
                onClose={closeUserDropdown}
                className="w-40 p-2"
              >
                <DropdownItem
                  onItemClick={closeUserDropdown}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  onItemClick={closeUserDropdown}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  Settings
                </DropdownItem>
                <DropdownItem
                  onItemClick={closeUserDropdown}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  Log Out
                </DropdownItem>
              </Dropdown>
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;