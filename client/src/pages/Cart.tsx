import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CartProductCard from "../components/CartProductCard";
import { useState } from "react";
import { toast } from "react-toastify";
import apiClient from "../apiClient";
import { resetCart } from "../redux/reducers/cart";
import { Link, useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state: RootState) => state.cart.products);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    try {
      setLoading("Processing...");

      if (!address.trim()) {
        return toast.error("Please enter address");
      } else if (!products.length) {
        return toast.error("No product found in the cart");
      }

      const productData = products.map((product) => ({
        id: product._id,
        count: product.count,
      }));

      await apiClient.post("/driver/place-order", {
        address,
        products: productData,
      });

      dispatch(resetCart());
      toast.success("Order placed successfully");
      navigate("/", { replace: true });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.message ||
          error.message
      );
    } finally {
      setLoading(null);
    }
  };

  return products.length ? (
    <div className="flex justify-around">
      <div className="flex flex-col gap-2 w-5/12">
        {products.map((product) => (
          <CartProductCard productData={product} />
        ))}
      </div>

      <div className="sticky top-10 w-1/4 card flex flex-col gap-2">
        <div className="rounded-xl bg-gray-800 p-4 border border-gray-700">
          <div className="text-lg">
            <span className="font-bold">Total Amount: </span>₹
            {products
              .reduce(
                (sum, product) => sum + Number(product.price) * product.count,
                0
              )
              .toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl bg-gray-800 p-4 border border-gray-700">
          <textarea
            value={address}
            className="textarea bg-white/5"
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
          ></textarea>
          <button
            className="btn btn-primary mt-2 w-full"
            onClick={handlePlaceOrder}
            disabled={!!loading}
          >
            {loading || "Place Order"}
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center mt-[20vh]">
      No products in the cart
      <br /> Browse products and Add to Cart <br />
      <Link to="/" className="btn btn-primary mt-2">
        Continue Shopping
      </Link>
    </div>
  );
};

export default Cart;
