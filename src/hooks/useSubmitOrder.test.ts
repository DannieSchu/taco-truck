import { MenuItem as MenuItemDetails } from "../models/menu";
import useSubmitOrder from "./useSubmitOrder";
import { act, renderHook } from "@testing-library/react";
import orderFixture from "../fixtures/order.json";
import OrderProvider from "../stores/OrderProvider";

describe("useSubmitOrder", () => {
  const renderUseSubmitOrder = (menu: MenuItemDetails[]) => renderHook(() => useSubmitOrder(menu), { wrapper: OrderProvider })

  it("submits an order", async () => {
    // @ts-ignore
    const spy = jest.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => orderFixture
    })

    const menu: MenuItemDetails[] = [
      {
        id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
        name: "Veggie Taco",
        category: "Tacos",
        price: 1.0
      },
      {
        id: "1f939cac-391f-438a-aeb5-b47299e625da",
        name: "Beef Taco",
        category: "Tacos",
        price: 1.0
      }
    ]
    const orderItemCounts = new Map<string, number>()
    orderItemCounts.set(menu[0].id, 3)
    orderItemCounts.set(menu[1].id, 1)

    const { result } = renderUseSubmitOrder(menu);

    await act(() => result.current.submitOrder(orderItemCounts));

    expect(result.current.isError).toEqual(false)
    expect(result.current.isLoading).toEqual(false)

    spy.mockRestore();
  })


  it("returns an error if menu item is not found", async () => {
    // @ts-ignore
    const spy = jest.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => orderFixture
    })

    const menu: MenuItemDetails[] = [
      {
        id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
        name: "Veggie Taco",
        category: "Tacos",
        price: 1.0
      }
    ]
    const orderItemCounts = new Map<string, number>()
    orderItemCounts.set("1f939cac-391f-438a-aeb5-b47299e625da", 1)

    const { result } = renderUseSubmitOrder(menu);

    await act(() => result.current.submitOrder(orderItemCounts));

    expect(result.current.isError).toEqual(true)
    expect(result.current.isLoading).toEqual(false)

    spy.mockRestore();
  })

  it("returns an error if api returns a non-200 status code", async () => {
    // @ts-ignore
    const spy = jest.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 410
    })

    const menu: MenuItemDetails[] = [
      {
        id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
        name: "Veggie Taco",
        category: "Tacos",
        price: 1.0
      },
      {
        id: "1f939cac-391f-438a-aeb5-b47299e625da",
        name: "Beef Taco",
        category: "Tacos",
        price: 1.0
      }
    ]
    const orderItemCounts = new Map<string, number>()
    orderItemCounts.set(menu[0].id, 3)
    orderItemCounts.set(menu[1].id, 1)

    const { result } = renderUseSubmitOrder(menu);

    await act(() => result.current.submitOrder(orderItemCounts));

    expect(result.current.isError).toEqual(true)
    expect(result.current.isLoading).toEqual(false)

    spy.mockRestore();
  })
})
