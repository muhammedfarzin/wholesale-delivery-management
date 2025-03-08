import { useEffect, useState } from "react";
import { ProductType } from "../types";
import ProductCard from "../components/ProductCard";
import apiClient from "../apiClient";
import { toast } from "react-toastify";

const DriverHome: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/driver/products")
      .then((response) => setProducts(response.data))
      .catch((error) =>
        toast.error(
          error.response?.data?.message ||
            error.response?.message ||
            error.message
        )
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-wrap gap-4">
      {loading ? (
        <span className="m-auto mt-4">Loading...</span>
      ) : (
        products.map((product) => <ProductCard productData={product} />)
      )}
    </div>
  );
};

export default DriverHome;
