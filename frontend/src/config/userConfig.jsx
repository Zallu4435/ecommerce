import TableRowForCartlist from "../components/user/ProductTable/TableRowForCartList";
import TableRow from "../components/user/ProductTable/ProductTable";

export const config1 = {
  cart: {
    headers: ["Remove", "Product Name", "Price", "Stock", "Action"],
    rowRenderer: (item, onRemoveFromCart, onUpdateQuantity) => (
      <TableRow
        key={item.id}
        item={item}
        onRemoveFromCart={onRemoveFromCart}
        onUpdateQuantity={onUpdateQuantity}
      />
    ),
  },
};

export const config2 = {
  cart: {
    headers: ["Remove", "Product Name", "Price", "Quantity", "Subtotal"],
    rowRenderer: (item, onRemoveFromCart, onUpdateQuantity) => (
      <TableRowForCartlist
        key={item.id}
        item={item}
        onRemoveFromCart={onRemoveFromCart}
        onUpdateQuantity={onUpdateQuantity}
      />
    ),
  },
};
