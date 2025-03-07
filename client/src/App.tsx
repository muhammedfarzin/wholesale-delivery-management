import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminHome from "./pages/AdminHome";
import ManageDrivers from "./pages/ManageDrivers";
import DriverForm from "./pages/DriverForm";

function App() {
  return (
    <Routes>
      <Route path="login" element={<Login type="driver" />} />
      <Route path="admin/login" element={<Login type="admin" />} />

      <Route path="admin" element={<AdminProtectedRoute />}>
        <Route index element={<AdminHome />} />
        <Route path="drivers" element={<ManageDrivers />} />
        <Route path="drivers/add" element={<DriverForm />} />
        <Route path="drivers/edit/:userId" element={<DriverForm />} />
      </Route>
    </Routes>
  );
}

export default App;
