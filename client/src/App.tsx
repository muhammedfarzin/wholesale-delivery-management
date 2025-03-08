import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminHome from "./pages/AdminHome";
import UserForm from "./pages/UserForm";
import PageNotFound from "./pages/PageNotFound";
import ManageUsers from "./pages/ManageUsers";
import ManageInventories from "./pages/ManageInventories";
import InventoryForm from "./pages/InventoryForm";
import DriverProtectedRouter from "./components/DriverProtectedRouter";
import DriverHome from "./pages/DriverHome";

function App() {
  return (
    <Routes>
      <Route path="login" element={<Login type="driver" />} />
      <Route path="admin/login" element={<Login type="admin" />} />

      <Route path="admin" element={<AdminProtectedRoute />}>
        <Route index element={<AdminHome />} />
        <Route path=":userType" element={<ManageUsers />} />
        <Route path="products" element={<ManageInventories />} />

        <Route path=":userType/add" element={<UserForm />} />
        <Route path=":userType/edit/:userId" element={<UserForm />} />

        <Route path="products/add" element={<InventoryForm />} />
        <Route path="products/edit/:productId" element={<InventoryForm />} />
      </Route>

      <Route path="/" element={<DriverProtectedRouter />}>
        <Route index element={<DriverHome />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
