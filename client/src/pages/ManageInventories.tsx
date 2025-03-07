import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminApiClient from "../adminApiClient";
import { toast } from "react-toastify";

interface ProductType {
  _id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  vendor: {
    _id: string;
    name: string;
  };
}

const ManageInventories = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    adminApiClient
      .get("/products")
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

  const handleDeleteProduct = (productId: string) => {
    const confirmDelete = confirm("Do you really want to delete this product?");

    if (!confirmDelete) return;

    adminApiClient
      .delete(`/product/${productId}`)
      .then(() =>
        setProducts((products) =>
          products.filter((product) => product._id !== productId)
        )
      )
      .catch((error) =>
        toast.error(
          error.response?.data?.message ||
            error.response?.message ||
            error.message
        )
      );
  };

  return (
    <div>
      <div className="flex justify-end">
        <Link to="add" className="btn btn-primary">
          Add Product
        </Link>
      </div>
      <table className="table max-w-5xl m-auto">
        <thead>
          <tr>
            <td>Image</td>
            <td>Name</td>
            <td>Price</td>
            <td>Category</td>
            <td>Vendor</td>
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
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">
                No products found
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id} className="capitalize">
                <td>
                  <img
                    src={product.image}
                    alt="product"
                    className="w-30 rounded-xl bg-white border-white"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.vendor.name}</td>
                <td className="join">
                  <Link to={`edit/${product._id}`} className="btn join-item">
                    Edit
                  </Link>
                  <button
                    className="btn btn-error text-white join-item"
                    onClick={() => handleDeleteProduct(product._id)}
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

export default ManageInventories;
