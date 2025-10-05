import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";

const LayoutContent: React.FC = () => {
  const { isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      {/* <div>
        <AppSidebar />
        <Backdrop />
      </div> */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out lg:ml-[0px] ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
