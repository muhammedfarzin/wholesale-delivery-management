import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { logout } from "../redux/reducers/auth";

const AdminProtectedRoute = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector((state: RootState) => state.auth.admin);

  useEffect(() => {
    if (!admin) navigate("/admin/login", { replace: true });
  }, [admin]);

  return (
    <div className="w-screen p-4">
      <div className="flex items-center justify-between">
        <Link to="/admin" className="text-lg font-bold">
          Admin Dashboard
        </Link>
        <div className="flex gap-2">
          <button
            className="btn btn-primary text-white"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            className="btn btn-error text-white"
            onClick={() => dispatch(logout({ role: "admin" }))}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="mt-10 ">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminProtectedRoute;
