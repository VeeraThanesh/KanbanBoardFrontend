import Sidebar from "../Components/Sidebar/Sidebar";
import { Menu } from "../Constant/SidebarMenu";
import Style from "./ProtectedLayout.module.scss";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return (
    <div className={Style.layoutContainer}>

      <div className={Style.sidebar}>
        <Sidebar
          menu={Menu}
          title="Kanban Board"
          // onNavigate={handleNavigate}
        />
      </div>
      <div className={Style.mainContent}>
        {/* <header className={Style.header}>   
          <Header />
        </header> */}
        <main className={Style.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
