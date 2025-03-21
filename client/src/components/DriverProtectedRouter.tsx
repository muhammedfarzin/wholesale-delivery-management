import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";
import { logout } from "../redux/reducers/auth";

const DriverProtectedRouter: React.FC = () => {
  const dispatch = useDispatch();
  const driver = useSelector((state: RootState) => state.auth.driver);
  const cartCount = useSelector((state: RootState) => state.cart.count);

  return driver ? (
    <div className="w-screen p-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-lg font-bold">
          Driver Dashboard
        </Link>
        <div className="flex gap-2">
          <div className="relative">
            <Link to="/cart" className="btn btn-primary">
              Cart
            </Link>
            {cartCount ? (
              <div className="absolute -top-2 -right-1 py-1 px-2 bg-red-900 rounded-full text-xs font-bold">
                {cartCount}
              </div>
            ) : null}
          </div>

          <Link to="/orders" className="btn btn-primary">
            Orders
          </Link>
          <button
            className="btn btn-error text-white"
            onClick={() => dispatch(logout({ role: "driver" }))}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="mt-10">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default DriverProtectedRouter;
