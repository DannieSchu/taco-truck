import { createOrder, OrderItemRequest } from "../services/orderService";
import { useCallback, useContext, useState } from "react";
import { MenuItem as MenuItemDetails } from "../models/menu";
import { OrderContext } from "../stores/OrderProvider";

type OrderItemCounts = Map<string, number>;

const useSubmitOrder = (menu: MenuItemDetails[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false)

  const {
    setOrderReadyTime,
    setOrderedMenuItems
  } = useContext(OrderContext);

  const submitOrder = useCallback(async (orderItemCounts: OrderItemCounts) => {
    const menuItemsToOrder = mapCountsToRequest(orderItemCounts, menu);
    const orderRequestBody = { orderItems: menuItemsToOrder };
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

const mapCountsToRequest = (orderItemCounts: OrderItemCounts, menu: MenuItemDetails[]): OrderItemRequest[] => {
  const orderItems: OrderItemRequest[] = []
  for (const [menuItemId, count] of orderItemCounts) {
    const menuItem = menu.find(item => item.id === menuItemId);

    if (!menuItem) throw Error(`Item with id ${menuItemId} not found`)

    orderItems.push({
      ...menuItem,
      quantity: count
    })
  }

  return orderItems;
};

export default useSubmitOrder;

export type {
  OrderItemCounts
}
