import { Outlet } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <>
      <header>
        <h2>Taco Town</h2>
      </header>
      <Outlet />
    </>
  );
};

export default Header;
