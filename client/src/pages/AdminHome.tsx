import { Link } from "react-router-dom";

const AdminHome: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-center">
      <Link
        to="admins"
        className="bg-sky-500 px-4 py-20 rounded-xl font-bold md:w-1/4 hover:opacity-70 cursor-pointer"
      >
        Admin Management
      </Link>
      <Link
        to="drivers"
        className="bg-sky-500 px-4 py-20 rounded-xl font-bold md:w-1/4 hover:opacity-70 cursor-pointer"
      >
        Truck Driver Management
      </Link>
      <Link
        to="vendors"
        className="bg-sky-500 px-4 py-20 rounded-xl font-bold md:w-1/4 hover:opacity-70 cursor-pointer"
      >
        Vendor Management
      </Link>
      <Link
        to="products"
        className="bg-sky-500 px-4 py-20 rounded-xl font-bold md:w-1/4 hover:opacity-70 cursor-pointer"
      >
        Product Inventory Management
      </Link>
      <Link
        to="orders"
        className="bg-sky-500 px-4 py-20 rounded-xl font-bold md:w-1/4 hover:opacity-70 cursor-pointer"
      >
        Order Management
      </Link>
    </div>
  );
};

export default AdminHome;
