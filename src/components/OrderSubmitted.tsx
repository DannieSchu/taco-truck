import { useContext } from "react";
import { OrderContext } from "../stores/OrderProvider";
import "./OrderSubmitted.css";

const OrderSubmitted = () => {
  const {
    orderReadyTime,
  } = useContext(OrderContext)

  // TODO redirect or display error if orderReadyTime is null
  return (
    <section className={"Order-page"}>
      <h1>Order Submitted</h1>
      <p>Your order will be ready for pickup at {orderReadyTime}</p>
    </section>
  );
};

export default OrderSubmitted;
