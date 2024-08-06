import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { OrderItemRequest } from "../services/orderService";

type OrderState = {
  orderReadyTime: string | null,
  setOrderReadyTime: Dispatch<SetStateAction<string | null>>
  orderedMenuItems: OrderItemRequest[]
  setOrderedMenuItems: Dispatch<SetStateAction<OrderItemRequest[]>>
}

const stub = (): never => {
  throw new Error(
    "You forgot to wrap your component in <OrderProvider>/"
  );
};

const initialOrderState: OrderState = {
  orderReadyTime: null,
  setOrderReadyTime: stub,
  orderedMenuItems: [],
  setOrderedMenuItems: stub
}

const OrderContext = createContext<OrderState>(initialOrderState);

const OrderProvider = ({ children }: { children: ReactNode }) => {

  const [orderReadyTime, setOrderReadyTime] = useState<null | string>(initialOrderState.orderReadyTime)
  const [orderedMenuItems, setOrderedMenuItems] = useState(initialOrderState.orderedMenuItems)

  return (
    <OrderContext.Provider value={{
      orderReadyTime,
      setOrderReadyTime,
      orderedMenuItems,
      setOrderedMenuItems
    }}>
      {children}
    </OrderContext.Provider>)
}

export default OrderProvider;

export {
  OrderContext
}
