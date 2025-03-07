import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import adminApiClient from "../adminApiClient";

interface FormDataType {
  name: string;
  price: string;
  category: string;
  image?: File;
  vendor: string;
}

interface VendorType {
  _id: string;
  name: string;
}

const InventoryForm = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [vendors, setVendors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    price: "",
    category: "",
    vendor: "",
  });

  useEffect(() => {
    setLoading("Loading...");
    try {
      adminApiClient
        .get("/users", { params: { type: "vendor" } })
        .then((response) => {
          const vendors: { [key: string]: string } = {};
          (response.data as VendorType[]).forEach(
            (vendor) => (vendors[vendor._id] = vendor.name)
          );
          setVendors(vendors);
        });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.message ||
          error.message
      );
    } finally {
      setLoading(null);
    }
  }, [productId]);

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    const { category, name, vendor } = formData;
    const price = Number(formData.price);

    if (!category.trim() || !name.trim() || !formData.price || !vendor.trim()) {
      return toast.error("All fields are required");
    } else if (isNaN(price)) {
      return toast.error("Please enter a valid price");
    } else if (price < 1) {
      return toast.error("Price cannot be less than 1 rupee");
    }

    try {
      await adminApiClient.post("/product", formData);
      navigate(-1);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.message ||
          error.message
      );
    }
  };

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      className="flex flex-col gap-2 max-w-md m-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center text-xl font-bold capitalize">Add Product</h1>
      <input
        className="input w-full"
        type="text"
        id="name"
        name="name"
        placeholder="Name of the product"
        value={formData.name}
        onChange={handleOnChange}
      />
      <input
        className="input w-full"
        type="number"
        id="price"
        min={1}
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleOnChange}
      />
      <input
        className="input w-full"
        type="text"
        id="category"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleOnChange}
      />

      <select
        className="select w-full"
        name="vendor"
        id="vendor"
        value={formData.vendor}
        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
      >
        <option disabled hidden value="">
          Select Vendor
        </option>
        {Object.keys(vendors).map((vendorId) => (
          <option
            key={vendorId}
            value={vendorId}
            selected={formData.vendor === vendorId}
          >
            {vendors[vendorId]}
          </option>
        ))}
      </select>

      <button className="btn" type="submit" disabled={!!loading}>
        {loading || "Add"}
      </button>
    </form>
  );
};

export default InventoryForm;
