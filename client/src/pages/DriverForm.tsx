import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import adminApiClient from "../adminApiClient";
import { useNavigate, useParams } from "react-router-dom";

interface FormDataType {
  name?: string;
  mobile?: string;
  drivingLicense?: string;
  address?: string;
}

const DriverForm = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    mobile: "",
    drivingLicense: "",
    address: "",
  });
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    adminApiClient.get(`/user/${userId}`).then((response) => {
      setFormData(response.data);
    });
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading("Adding...");

    const { name, mobile, drivingLicense, address } = formData;
    const mobileRegex = /^[6-9]\d{9}$/;
    console.log(
      name?.trim(),
      mobile?.trim(),
      drivingLicense?.trim(),
      address?.trim()
    );
    try {
      if (
        !name?.trim() ||
        !mobile?.trim() ||
        !drivingLicense?.trim() ||
        !address?.trim()
      ) {
        toast.error("All fields are required.");
        return;
      }

      if (!mobileRegex.test(mobile)) {
        toast.error("Please enter a valid mobile number.");
        return;
      }

      const response = await (userId
        ? adminApiClient.put
        : adminApiClient.post)("/user", {
        ...formData,
        role: "truck_driver",
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
      <h1 className="text-center text-xl font-bold">Add Driver</h1>
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
      <input
        className="input w-full"
        type="text"
        id="drivingLicense"
        name="drivingLicense"
        placeholder="Driving License"
        value={formData.drivingLicense}
        onChange={handleOnChange}
      />
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

export default DriverForm;
