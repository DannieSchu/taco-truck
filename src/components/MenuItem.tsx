import { MenuItem as MenuItemDetails } from "../models/menu";

const MenuItem = ({
  menuItem,
  handleAdd
}: {
  menuItem: MenuItemDetails;
  handleAdd: (id: string) => void;
}) => {
  const onClick = () => {
    handleAdd(menuItem.id);
  };

  return (
    <article data-testid={`menuitem-${menuItem.id}`}>
      <div>
        <h2>{menuItem.name}</h2>
        <p>{menuItem.price.toFixed(2)}</p>
      </div>
      <button onClick={onClick}>Add to Order</button>
    </article>
  );
};

export default MenuItem;
