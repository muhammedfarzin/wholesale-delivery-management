import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import adminApiClient from "../adminApiClient";
import { useNavigate, useParams } from "react-router-dom";

interface FormDataType {
  username?: string;
  name?: string;
  mobile?: string;
  drivingLicense?: string;
  address?: string;
}

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { userId, userType } = useParams();
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    mobile: "",
    drivingLicense: "",
    address: "",
  });
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (
      userType !== "admins" &&
      userType !== "drivers" &&
      userType !== "vendors"
    ) {
      navigate("/404", { replace: true });
      return;
    }

    adminApiClient.get(`/user/${userId}`).then((response) => {
      setFormData(response.data);
    });
  }, [userId, userType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading("Adding...");

    const { username, name, mobile, drivingLicense, address } = formData;
    const mobileRegex = /^[6-9]\d{9}$/;

    try {
      if (
        !name?.trim() ||
        !mobile?.trim() ||
        (userType === "drivers" && !drivingLicense?.trim()) ||
        ((userType === "drivers" || userType === "vendors") &&
          !address?.trim()) ||
        (userType === "admin" && !username?.trim())
      ) {
        toast.error("All fields are required.");
        return;
      }

      if (!mobileRegex.test(mobile)) {
        toast.error("Please enter a valid mobile number.");
        return;
      }

      const role =
        userType === "drivers" ? "truck_driver" : userType?.slice(0, -1);

      const response = await (userId
        ? adminApiClient.put
        : adminApiClient.post)("/user", {
        ...formData,
        role,
        userId,
      });
      toast.success(response.data?.message || "Driver added successfully.");
      navigate(-1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(null);
    }
  };

  const handleOnChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      className="flex flex-col gap-2 max-w-md m-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center text-xl font-bold capitalize">
        Add {userType}
      </h1>
      {userType === "admins" && (
        <input
          className="input w-full"
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleOnChange}
        />
      )}
      <input
        className="input w-full"
        type="text"
        id="name"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleOnChange}
      />
      <input
        className="input w-full"
        type="tel"
        id="mobile"
        name="mobile"
        placeholder="Mobile Number"
        value={formData.mobile}
        onChange={handleOnChange}
      />
      {userType === "drivers" && (
        <input
          className="input w-full"
          type="text"
          id="drivingLicense"
          name="drivingLicense"
          placeholder="Driving License"
          value={formData.drivingLicense}
          onChange={handleOnChange}
        />
      )}
      <textarea
        className="textarea w-full"
        id="address"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleOnChange}
      />
      <button className="btn" type="submit" disabled={!!loading}>
        {loading || "Add"}
      </button>
    </form>
  );
};

export default UserForm;
