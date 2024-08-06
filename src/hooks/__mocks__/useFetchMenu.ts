const useFetchMenu = jest.fn(() => {
  return {
    fetchMenu: jest.fn(),
    isError: false,
    isLoading: false,
    menu: []
  };
});

export default useFetchMenu;
