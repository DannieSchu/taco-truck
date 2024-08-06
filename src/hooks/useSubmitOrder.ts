import { createOrder, OrderItemRequest } from "../services/orderService";
import { useCallback, useContext, useState } from "react";
import { MenuItem, OrderedMenuItem } from "../models/menu";
import { OrderContext } from "../stores/OrderProvider";

const useSubmitOrder = (menu: MenuItem[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false)

  const {
    setOrderReadyTime,
    setOrderedMenuItems
  } = useContext(OrderContext);

  const submitOrder = useCallback(async (orderItemCounts: OrderItemCounts) => {
    const menuItemsToOrder = mapCountsToOrder(orderItemCounts, menu);
    const orderRequestBody = { orderItems: mapOrderToRequest(menuItemsToOrder) };
    setIsLoading(true);
    setIsError(false);

    try {
      const { orderReadyTime = null } = await createOrder(orderRequestBody)
      setOrderReadyTime(orderReadyTime)
      setOrderedMenuItems(menuItemsToOrder)
    } catch (e) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [menu, setOrderReadyTime, setOrderedMenuItems])

  return {
    isError,
    isLoading,
    submitOrder
  }
}

const mapCountsToOrder = (orderItemCounts: OrderItemCounts, menuItems: MenuItem[]): OrderedMenuItem[] => {
  const orderItems: OrderedMenuItem[] = []
  for (const [menuItemId, count] of orderItemCounts) {
    const menuItem = menuItems.find(item => item.id === menuItemId);
    if (!menuItem) throw Error(`Item with id ${menuItemId} not found`)

    orderItems.push({
      ...menuItem,
      quantity: count
    })
  }

  return orderItems;
};

const mapOrderToRequest = (menuItemsToOrder: OrderedMenuItem[]): OrderItemRequest[] => {
  return menuItemsToOrder.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    category: item.category,
    price: (item.priceInCents / 100)
  }))
};

export type OrderItemCounts = Map<string, number>;

export default useSubmitOrder;

