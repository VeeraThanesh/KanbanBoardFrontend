// import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import ReportGmailerrorred from "@mui/icons-material/ReportGmailerrorred";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";

const Menu = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <BrandingWatermarkOutlinedIcon />,
    subMenu: [],
  },
  {
    title: "User",
    path: "/user",
    icon: <SummarizeOutlinedIcon />,
    subMenu: [],
  },
  {
    title: "Projects",
    path: "/projects",
    icon: <AutoAwesomeMosaicIcon />,
    subMenu: [],
  },
  {
    title: "Task",
    path: "/tasks",
    icon: <AccessTimeIcon />,
    subMenu: [],
  },

  // {
  //   title: "Master",
  //   path: "#",
  //   icon: <AutoAwesomeMosaicIcon />,
  //   subMenu: [
  //     {
  //       title: "Building",
  //       path: "/underConstruction",
  //       subMenu: [],
  //     },
  //     {
  //       title: "Connections",
  //       path: "/underConstruction",
  //       subMenu: [],
  //     },
  //     {
  //       title: "Shift",
  //       path: "/shift",
  //       subMenu: [],
  //     },
  //   ],
  // },
];

const USERMenu = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <BrandingWatermarkOutlinedIcon />,
    subMenu: [],
  },
  {
    title: "Projects",
    path: "/projects",
    icon: <AutoAwesomeMosaicIcon />,
    subMenu: [],
  },
  {
    title: "Task",
    path: "/tasks",
    icon: <AccessTimeIcon />,
    subMenu: [],
  },
];

const PMMenu = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <BrandingWatermarkOutlinedIcon />,
    subMenu: [],
  },
  // {
  //   title: "Feedbacks",
  //   path: "/feedback",
  //   icon: <FeedbackOutlinedIcon />,
  //   subMenu: [],
  // },
];

export { Menu, USERMenu, PMMenu };
