export type SubmitOrderRequestBody = {
  customerName?: string;
  totalPrice?: number;
  orderItems?: OrderItemRequest[];
};

export type OrderItemRequest = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

type SubmitOrderResponse = {
  orderStatus?: string;
  orderReadyTime?: string;
};

type ErrorResponse = {
  errorCode?: string;
  errorMessage?: string;
};

export const createOrder = async (orderRequestBody: SubmitOrderRequestBody): Promise<SubmitOrderResponse> => {
  const response = await fetch("https://virtserver.swaggerhub.com/Detroit_Labs/Taco_Truck/1.0.0/order",
    {
      method: "POST",
      body: JSON.stringify(orderRequestBody)
    }
  );
  return await response.json();
};
