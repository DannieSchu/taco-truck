import { MenuItem as MenuItemDetails } from "../models/menu";

const MenuItem = ({
  menuItem,
  onClick,
}: {
  menuItem: MenuItemDetails;
  onClick: () => void;
}) => {
  return (
    <article>
      <div>
        <h2>{menuItem.name}</h2>
        <p>{menuItem.price.toFixed(2)}</p>
      </div>
      <button onClick={onClick}>Add to Order</button>
    </article>
  );
};

export default MenuItem;
