import { useDispatch } from "react-redux";
import { ProductType } from "../types";
import { addToCart } from "../redux/reducers/cart";

interface ProductCardProps {
  productData: ProductType;
}

const ProductCard: React.FC<ProductCardProps> = ({ productData }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(productData));
  };

  return (
    <div className="card rounded-xl bg-gray-800 p-4 w-full md:w-1/5 flex flex-col gap-0.5 border border-gray-700">
      <img
        className="rounded-lg aspect-square object-contain bg-white"
        src={productData.image}
        alt="product"
      />
      <div className="text-xl font-bold mt-2">
        ₹{Number(productData.price).toLocaleString()}
      </div>
      <div className="text-base line-clamp-1">{productData.name}</div>
      <div className="text-xs">
        <span className="font-bold">From:</span> {productData.vendor.name}
      </div>
      <button className="btn btn-primary mt-1" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
