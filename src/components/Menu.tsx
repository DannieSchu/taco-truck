import MenuItem from "./MenuItem";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSubmitOrder from "../hooks/useSubmitOrder";
import useFetchMenu from "../hooks/useFetchMenu";
import "./Menu.css";

const Menu = () => {
  const [orderItemCounts, setOrderItemCounts] = useState(new Map<string, number>());
  const navigate = useNavigate()
  const { isLoading: isMenuLoading, menu, fetchMenu } = useFetchMenu()
  const { submitOrder } = useSubmitOrder(menu);

  useEffect(() => {
    fetchMenu().then()
  }, [fetchMenu]);

  const handleAdd = useCallback((menuItemId: string) => {
    const count = orderItemCounts.get(menuItemId) || 0;
    setOrderItemCounts(new Map(orderItemCounts.set(menuItemId, count + 1)));
  }, [orderItemCounts]);

  const onSubmit = useCallback(async () => {
    await submitOrder(orderItemCounts);
    setOrderItemCounts(new Map<string, number>());
    navigate("/order")
  }, [navigate, orderItemCounts, submitOrder])

  return (
    <section className={"Menu-page"}>
      <h1>Menu</h1>
      {isMenuLoading ? (
        <p data-testid="loading">loading</p>
      ) : (
        <>
          <ul>
            {menu.map((item) => (
              <li key={item.id}>
                <MenuItem menuItem={item} handleAdd={handleAdd}/>
              </li>
            ))}
          </ul>
          {
            // TODO confirm desire for order summary and extract as needed
            orderItemCounts.size > 0 ? (
              <section className={"Order-summary"}>
                <h2>Order Summary</h2>
                <p>Item count: {[...orderItemCounts.values()].reduce((prev, curr) => prev + curr)}</p>
                <button onClick={onSubmit}>Submit Order</button>
              </section>
            ) : null}
        </>
      )}
    </section>
  );
};

export default Menu;
