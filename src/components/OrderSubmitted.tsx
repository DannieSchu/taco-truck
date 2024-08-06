import { useContext, useEffect } from "react";
import { OrderContext } from "../stores/OrderProvider";
import { useNavigate } from "react-router-dom";
import "./OrderSubmitted.css";

const OrderSubmitted = () => {
  const {
    orderReadyTime,
  } = useContext(OrderContext)
    const navigate = useNavigate();

  useEffect(() => {
    if (!orderReadyTime) {
      navigate("/")
    }
  }, [orderReadyTime, navigate])

  // TODO validate date
  const date = new Date(orderReadyTime!!).toTimeString()

  return (
    <section className={"Order-page"}>
      <h1>Order Submitted</h1>
      <p>Your order will be ready for pickup at {date}</p>
    </section>
  );
};

export default OrderSubmitted;
