import { useEffect, useState } from "react";
import adminApiClient from "../adminApiClient";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

interface Driver {
  _id: string;
  name: string;
  mobile: string;
  address: string;
  drivingLicense: string;
}

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    adminApiClient
      .get("/users", { params: { type: "truck_driver" } })
      .then((response) => setDrivers(response.data))
      .catch((error) =>
        toast.error(error.response?.data?.message || error.message)
      )
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (!confirm) return;

      await adminApiClient.delete(`/user/${userId}`);
      setDrivers((drivers) =>
        drivers.filter((driver) => driver._id !== userId)
      );
      toast.success("Driver deleted successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-end">
        <Link to="add" className="btn btn-primary">
          Add Driver
        </Link>
      </div>
      <table className="table max-w-5xl m-auto">
        <thead>
          <tr>
            <td>Name</td>
            <td>Mobile</td>
            <td>Address</td>
            <td>Driving Lisence</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center">
                Loading...
              </td>
            </tr>
          ) : drivers.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">
                No drivers found
              </td>
            </tr>
          ) : (
            drivers.map((driver) => (
              <tr key={driver._id}>
                <td>{driver.name}</td>
                <td>{driver.mobile}</td>
                <td>{driver.address}</td>
                <td>{driver.drivingLicense}</td>
                <td className="join">
                  <Link to={`edit/${driver._id}`} className="btn join-item">
                    Edit
                  </Link>
                  <button
                    className="btn btn-error text-white join-item"
                    onClick={() => handleDeleteUser(driver._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageDrivers;
