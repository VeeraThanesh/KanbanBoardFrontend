import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import UnderConstruction from "../Components/UnderConstruction/UnderConstruction";
import NotFound from "../Components/NotFound/NotFound";
import SignUp from "../Pages/SignUp/SignUp";
import Users from "../Pages/Users/User";
import ProtectedRoute from "./protectedRoute";
import ProtectedLayout from "./protectedLayout";
import TaskManagement from "../Pages/TaskManagement/TaskManagement";
import TaskDetails from "../Pages/TaskManagement/TaskDetails";
import ProjectManagement from "../Pages/ProjectManagement/ProjectManagement";

const Routing = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />

      {/* Protected Layout */}
      <Route element={<ProtectedLayout />}>
        {/* Admin + User */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "USER"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={<Users />} />
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/underConstruction" element={<UnderConstruction />} />
        </Route>

      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routing;
