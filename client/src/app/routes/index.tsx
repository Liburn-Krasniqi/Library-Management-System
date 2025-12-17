import { Route, Routes } from "react-router";

import { Layout } from "../../components";
import {
  AdminBooks,
  Books,
  Dashboard,
  Landing,
  Login,
  Register,
} from "../../features";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public pages: only accessible if not logged in */}
        <Route element={<PublicRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected pages: only accessible if logged in */}
        <Route element={<PrivateRoute />}>
          <Route path="books" element={<Books />} />
          <Route path="admin/users" element={<Dashboard />} />
          <Route path="admin/books" element={<AdminBooks />} />
        </Route>

        <Route index element={<Landing />} />
      </Route>
    </Routes>
  );
}
