import { Outlet } from "react-router-dom";

const Header = () => {
  return (
    <>
      <header>
        <h2>Taco Truck</h2>
      </header>
      <Outlet />
    </>
  );
};

export default Header;
