import { Route, Routes } from "react-router";

import { Layout } from "../../components";
import { Landing, Login, Register } from "../../features";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}
