import TableRow from '../components/user/ProductTable/TableRow'


export const config = {
    cart: {
      headers: ['Product Name', 'Quantity', 'Price', 'Total Amount', 'Actions'],
      rowRenderer: (item) => <TableRow item={item} type="cart" />,
    },
    wishlist: {
      headers: ['Remove', 'Product Name', 'Price', 'Stock', 'Actions'],
      rowRenderer: (item) => <TableRow item={item} type="wishlist" />,
    },
  };
  