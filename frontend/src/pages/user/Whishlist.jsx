import ProductTable from '../../components/user/ProductTable/ProductTable';

const Wishlist = () => {
  const products = [
    { id: 1, name: 'Product 1', price: 99.99, image: 'https://via.placeholder.com/400', rating: 4.5, stock: 'In stoke' },
    { id: 2, name: 'Product 2', price: 129.99, image: 'https://via.placeholder.com/400', rating: 4.2, stock: 'In stoke' },
    { id: 3, name: 'Product 3', price: 89.99, image: 'https://via.placeholder.com/400', rating: 4.7, stock: 'In stoke' },
  ];

  return (
    <ProductTable
        type="wishlist" 
        data={products} 
    />
  );
};

export default Wishlist;
