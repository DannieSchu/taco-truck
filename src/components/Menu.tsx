import { getMenu } from "../services/menuService";
import { MenuItem as MenuItemDetails } from "../models/menu";
import MenuItem from "./MenuItem";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSubmitOrder from "../hooks/useSubmitOrder";

const defaultOrderItemCounts = new Map<string, number>()

const Menu = () => {
  const [menu, setMenu] = useState<MenuItemDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderItemCounts, setOrderItemCounts] = useState(defaultOrderItemCounts);
  const navigate = useNavigate()
  const { isError: isOrderError, isLoading: isOrderLoading, submitOrder } = useSubmitOrder(menu);

  // TODO decouple presentation from business logic
  const fetchMenu = useCallback(async () => {
    const menuResponse = await getMenu();
    return menuResponse.map((menuItem) => ({
      id: menuItem.id,
      name: menuItem.name,
      // TODO validate and convert price
      price: menuItem.price,
      // TODO category enum?
      category: menuItem.category
    }));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    // TODO handle errors
    fetchMenu()
      .then((menu) => setMenu(menu))
      .finally(() => setIsLoading(false));
  }, [fetchMenu]);

  const handleAdd = useCallback((menuItemId: string) => {
    const count = orderItemCounts.get(menuItemId) || 0;
    setOrderItemCounts(new Map(orderItemCounts.set(menuItemId, count + 1)));
  }, [orderItemCounts]);

  const onSubmit = useCallback(async () => {
    await submitOrder(orderItemCounts);
    setOrderItemCounts(defaultOrderItemCounts);
    navigate("/order")
  }, [navigate, orderItemCounts, submitOrder])

  return (
    <>
      <h1>Menu</h1>
      {isLoading ? (
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
              <section>
                <h2>Order Summary</h2>
                <p>Item count: {[...orderItemCounts.values()].reduce((prev, curr) => prev + curr)}</p>
                <button onClick={onSubmit}>Submit Order</button>
              </section>
            ) : null}
        </>
      )}
    </>
  );
};

export default Menu;
