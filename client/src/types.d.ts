export interface ProductType {
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