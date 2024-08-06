const useSubmitOrder = jest.fn(() => {
  return {
    isError: false,
    isLoading: false,
    submitOrder: jest.fn()
  };
});

export default useSubmitOrder;
