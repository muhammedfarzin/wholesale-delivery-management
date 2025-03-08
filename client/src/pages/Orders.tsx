import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";
import { toast } from "react-toastify";
import adminApiClient from "../adminApiClient";

interface OrderProps {
  type: "driver" | "admin";
}

interface OrderDataType {
  _id: string;
  orderedBy: {
    _id: string;
    name: string;
  };
  productId: string;
  address: string;
  count: number;
  price: number;
  product: {
    _id: string;
    name: string;
    vendorId: string;
    image: string;
    vendor: {
      _id: string;
      name: string;
    };
  };
  status: "pending" | "delivered" | "cancelled";
}

const Orders: React.FC<OrderProps> = ({ type }) => {
  const [orders, setOrders] = useState<OrderDataType[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    setLoading("Loading...");
    (type === "driver" ? apiClient : adminApiClient)
      .get(`/${type}/orders`)
      .then((response) => setOrders(response.data))
      .catch((error) =>
        toast.error(
          error.response?.data?.message ||
            error.response?.message ||
            error.message
        )
      )
      .finally(() => setLoading(null));
  }, [type]);

  const updateStatus = (orderId: string, status: OrderDataType["status"]) => {
    if (status === "pending") return;

    setLoading("Updating...");

    (type === "driver" ? apiClient : adminApiClient)
      .put(`/${type}/order/${orderId}/status`, { status })
      .then(() => {
        setOrders((orders) =>
          orders.map((order) => {
            if (order._id === orderId) order.status = status;
            return order;
          })
        );
        toast.success("Status updated successfully");
      })
      .catch((error) =>
        toast.error(
          error.response?.data?.message ||
            error.response?.message ||
            error.message
        )
      )
      .finally(() => setLoading(null));
  };

  return (
    <div>
      <table className="table max-full m-auto">
        <thead>
          <tr>
            <td>Image</td>
            <td>Name</td>
            <td>Price</td>
            <td>Count</td>
            <td>Address</td>
            <td>Vendor</td>
            <td>Status</td>
            {type === "admin" && <td>OrderedBy</td>}
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {loading === "Loading..." || !orders.length ? (
            <tr>
              <td colSpan={7} className="text-center">
                {loading || "No orders found"}
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id} className="capitalize">
                <td>
                  <img
                    src={order.product.image}
                    alt="product"
                    className="w-30 rounded-xl bg-white border-white p-2"
                  />
                </td>
                <td>{order.product.name}</td>
                <td>{order.price}</td>
                <td>{order.count}</td>
                <td>{order.address}</td>
                <td>{order.product.vendor.name}</td>
                <td
                  className={
                    order.status === "cancelled"
                      ? "text-red-500"
                      : order.status === "delivered"
                      ? "text-primary"
                      : ""
                  }
                >
                  {order.status}
                </td>
                {order.status === "pending" && (
                  <td className="join">
                    <button
                      className="btn btn-error join-item"
                      onClick={() => updateStatus(order._id, "cancelled")}
                      disabled={!!loading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary join-item"
                      onClick={() => updateStatus(order._id, "delivered")}
                      disabled={!!loading}
                    >
                      Mark as Delivered
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
