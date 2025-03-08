import { useDispatch } from "react-redux";
import { ProductType } from "../types";
import Counter from "./Counter";
import { addToCart, removeFromCart } from "../redux/reducers/cart";

interface CartProductCardProps {
  productData: ProductType & { count: number };
}

const CartProductCard: React.FC<CartProductCardProps> = ({ productData }) => {
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(addToCart(productData));
  };

  const handleDecrement = () => {
    dispatch(removeFromCart(productData._id));
  };
  return (
    <div className="card rounded-xl bg-gray-800 p-4 w-full flex flex-row gap-4 border border-gray-700">
      <img
        className="w-1/3 rounded-xl aspect-square bg-white p-2"
        src={productData.image}
        alt="product"
      />
      <div className="flex flex-col gap-1 items-start">
        <div className="text-base line-clamp-2">{productData.name}</div>
        <div className="text-2xl font-bold">
          ₹{Number(productData.price).toLocaleString()}
        </div>
        <Counter
          value={productData.count}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
        <div className="text-xs">
          <span className="font-bold">Seller: </span>
          {productData.vendor.name}
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
