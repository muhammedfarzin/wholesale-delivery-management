import { useEffect, useState } from "react";
import adminApiClient from "../adminApiClient";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";

interface Driver {
  _id: string;
  name: string;
  mobile: string;
  address: string;
  drivingLicense: string;
}

const ManageUsers = () => {
  const navigate = useNavigate();
  const { userType } = useParams();
  const [users, setUsers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      userType !== "admins" &&
      userType !== "users" &&
      userType !== "vendors"
    ) {
      navigate("/404", { replace: true });
    }
  }, [userType]);

  useEffect(() => {
    setLoading(true);

    const type =
      userType === "drivers" ? "truck_driver" : userType?.slice(0, -1);

    adminApiClient
      .get("/users", { params: { type } })
      .then((response) => setUsers(response.data))
      .catch((error) =>
        toast.error(error.response?.data?.message || error.message)
      )
      .finally(() => setLoading(false));
  }, []);

  const fetchTableHeadings = () => {
    if (userType === "admins") return ["username", "name", "mobile"];
    if (userType === "drivers")
      return ["name", "mobile", "address", "Driving Lisence"];
    if (userType === "vendors") return ["name", "mobile", "address"];
    return [];
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (!confirm) return;

      await adminApiClient.delete(`/user/${userId}`);
      setUsers((users) => users.filter((user) => user._id !== userId));
      toast.success("Driver deleted successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.response.message || error.message
      );
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
            {fetchTableHeadings().map((value) => (
              <td className="capitalize">{value}</td>
            ))}
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
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.mobile}</td>
                <td>{user.address}</td>
                <td>{user.drivingLicense}</td>
                <td className="join">
                  <Link to={`edit/${user._id}`} className="btn join-item">
                    Edit
                  </Link>
                  <button
                    className="btn btn-error text-white join-item"
                    onClick={() => handleDeleteUser(user._id)}
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

export default ManageUsers;
