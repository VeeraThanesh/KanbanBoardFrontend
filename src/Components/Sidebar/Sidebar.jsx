import { NavLink, useNavigate } from "react-router-dom";
import { Menu, USERMenu, PMMenu } from "../../Constant/SidebarMenu";
import Styles from "./Sidebar.module.scss";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Role → Menu mapping
  const ROLE_MENU = {
    ADMIN: Menu,
    USER: USERMenu,
    PM: PMMenu,
  };

  const menuItems = ROLE_MENU[role] || [];

  return (
    <aside className={Styles.Sidebar}>
      <ul className={Styles.SidebarMenu}>
        {menuItems.map((item) => (
          <li key={item.title} className={Styles.MenuItem}>
            {/* Main Menu */}
            {item.path !== "#" ? (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `${Styles.MenuLink} ${isActive ? Styles.Active : ""}`
                }
              >
                <span className={Styles.Icon}>{item.icon}</span>
                <span className={Styles.Title}>{item.title}</span>
              </NavLink>
            ) : (
              <div className={Styles.MenuLink}>
                <span className={Styles.Icon}>{item.icon}</span>
                <span className={Styles.Title}>{item.title}</span>
              </div>
            )}

            {/* Sub Menu */}
            {item.subMenu?.length > 0 && (
              <ul className={Styles.SubMenu}>
                {item.subMenu.map((sub) => (
                  <li key={sub.path}>
                    <NavLink
                      to={sub.path}
                      className={({ isActive }) =>
                        `${Styles.SubMenuLink} ${isActive ? Styles.Active : ""}`
                      }
                    >
                      {sub.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div className={Styles.LogoutSection}>
        <div className={Styles.MenuLink} onClick={handleLogout}>
          <span className={Styles.Icon}>
            <LogoutIcon />
          </span>
          <span className={Styles.Title}>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
