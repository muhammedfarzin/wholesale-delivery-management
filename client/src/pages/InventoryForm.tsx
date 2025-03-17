import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import adminApiClient from "../adminApiClient";

interface FormDataType {
  name: string;
  price: string;
  category: string;
  image?: File | string;
  vendor: string;
}

interface VendorType {
  _id: string;
  name: string;
}

const InventoryForm = () => {
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);
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

      if (productId) {
        adminApiClient
          .get(`/product/${productId}`)
          .then((response) =>
            setFormData({ ...response.data, vendor: response.data.vendorId })
          );
      }
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
    const { category, name, vendor, image } = formData;
    const price = Number(formData.price);

    if (
      !category?.trim() ||
      !name?.trim() ||
      !formData.price ||
      !vendor?.trim() ||
      !image
    ) {
      return toast.error("All fields are required");
    } else if (isNaN(price)) {
      return toast.error("Please enter a valid price");
    } else if (price < 1) {
      return toast.error("Price cannot be less than 1 rupee");
    }

    try {
      const data = { ...formData };

      if (typeof data.image === "string") {
        delete data.image;
      }

      await (productId ? adminApiClient.put : adminApiClient.post)(
        `/product/${productId ? productId : ""}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
      <img
        className="max-w-40 w-full max-h-40 rounded-lg m-auto cursor-pointer"
        onClick={() => imageInputRef.current?.click()}
        src={
          formData.image
            ? typeof formData.image === "string"
              ? formData.image
              : URL.createObjectURL(formData.image)
            : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAZlBMVEX///8AAADt7e1XV1e0tLSlpaUQEBDJycn8/Pz19fX4+PheXl7y8vLNzc1nZ2fc3NyDg4Pn5+dDQ0NycnI9PT0fHx/Dw8MkJCSVlZV6enoYGBg3NzdRUVFtbW0yMjKbm5uLi4srKyujOb1yAAAEv0lEQVRoge2Z2ZajIBCGg1twRY3iEo3m/V9yKBQFJVGjF3PmTF1023b8BKrqr4Lcbv/tv/29hhNqnTFKvE9owy7QaauInt2cRzMrLA07SS9hM1vTcQz3m84+ZQ+AZMZq4HC7dA94X2deqB26zW5WJ9FgFsx/ebNlN+kF8OSJUL28aSLk3C+AGwyE/mW4Z3zM5bNwWrZ+Wx538Q64EY3ZFq0S4jSczFKQ6oXoBFyWmfRiOGSrUyW3pHLYlX0pHPvs/z2/7NmVj6+EkxdC+UDEOUKvQ6u+BQ/rWXtYAanDS+H57Ebm2vxSONQkZ1gLwjyaJnpMkCSaJNiMFqgnPjxogGsfWjTu/CJPu9WLN+G8nDx7u3/BhXZVgnbIgpW3t5MolpIo1rE9IQ8oX4x9G+5VE7vSSmPP/1fDDzM4CGelMIUn61TXhAwpjCo8/FaTbJfkupR1ClTfDdBcjJivX3kY/sUMvhw8DL3HspVYwN2DcCNjjxdjlHj+gq7C7aj0jsBxq+CSN/hmDkgFTsZP7obzQOnmvwnQs4muwONRsffCoaNSk/bOm0zhegXOZM+h++GgmMvQHgJTA4dJpcYnuEEIUaKYcGEIFh/reCbjFRxmGd30cGz5b+f5kLSF7w/WY/Da2Q8yvBdFcg0PHoMAOFMRdVdRLei8otMFnA/F0MLddtIXQY/lPxTj25IiVOHQ8uc3HXzUrieaB7sOlNm4M16uArcmTV3AA3+URJKJ9eTsaOlMYSF0IVkgw32xVAu4y8cdQfBCpYOxQ0+wUm/JeEC2WIKzizdZwwdftsMoQ16POr6R/FareerGwQQPxfBU+FBnKpF0fMw8br43vTwCSl/ASyRaKxk++NKftZyv51K418ZDry4EPJqWXIIH6rj52LMvgTJbkI1T5M/AzstbwIdMadUaRNaKojNopwScorlvE3DFlxK9irfZLFydCV5KCTfCh8pS/byTtgScK4JQ+QHuLn152PoRbsjyCfDQXfvyqHGVGacQC7lm8JpWGl8eNJGhrayf7F6eflWPY3AWiO8pn80xRE+tyQyHoGymTnCE+7/smjVw9YSFhyB6nFuT26ABzg1XSD5h4XHyOHtSxLKNaUtxS0AI5tLO5fjoXlxjEOcRlwtpdxyAmqUkMU4Z6QfVt5HSlQ1DR6l5xppiLGDNsrDMu4lzBrs/FohPtSL2zhXsCKDst7lwIIlP45s7D7h87uCvN8iajaL4u0EZQjY+dN6x21ye8EVFw7NpaYRr0SCj9wo/ts6MP0hrTemSjsnQsyTJj2+ApNS01YYlH/a/Yjv8gY+l5ke1wKDte+bnaWQFB1/Am5/Pz4R29UTyClFy4AVy86M1TMIyk/ltufvQGJqfbvNT2Koa+bsc0yI79N2DSX/u2mV+aMXyDNLe2jo9g+Yn21scsUE6OYbeTfy1K1ean31voH30kt7Q2OGnmfv6KP9uLqG9HENpbOs0FCvNzxHDhhVl9cR3Xo+7sUh0yjTE/Fk8Atq1Ugw5pk3lFYJtv/b8bq+5SahUwKydzip5f3L+e5TArkz5DS0lSUJgm1KcZoMZodVK+LoZVPVwrHwy7JK+kZSOWX9tLUus0pyGvy0rhy0gdybVzqvT9w9/AEX3OqqVhTD2AAAAAElFTkSuQmCC"
        }
        alt=""
      />
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
      <input
        ref={imageInputRef}
        type="file"
        hidden
        accept="image/*"
        value={[]}
        onChange={(e) => {
          if (e.target.files && !e.target.files[0].type.startsWith("image"))
            toast.error("Invalid image type");
          else if (e.target.files)
            setFormData({ ...formData, image: e.target.files[0] });
        }}
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
