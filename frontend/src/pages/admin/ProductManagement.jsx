import { useState } from 'react'
import AdminTable from '../../components/admin/AdminTable'
import AdminSidebar from '../../components/admin/AdminSidebar';

const ProductManagement = () => {

    const [search, setSearch] = useState('');

    const products = [
        {
          id: 1,  
          productName: "Wireless Headphones",
          category: "Electronics",
          brand: "Sony",
          originalPrice: "$150",
          offerPrice: "$120",
        },
        {
          id: 2,  
          productName: "Smartphone Case",
          category: "Accessories",
          brand: "Spigen",
          originalPrice: "$25",
          offerPrice: "$18",
        },
        {
          id: 3,  
          productName: "Laptop",
          category: "Electronics",
          brand: "Dell",
          originalPrice: "$800",
          offerPrice: "$700",
        }
      ];
      

  return (
    <div className='flex dark:bg-black dark:text-white space-x-16'>
      
      <AdminSidebar />


      <div className='dark:bg-gray-900 bg-orange-50 px-14 my-12'>
        <h1 className="text-3xl font-bold ml-[-30px] my-6 text-gray-400">Category Management</h1>
        
        <AdminTable type="products" data={products} search={search} setSearch={setSearch} />

      </div>

    </div>
  )
}

export default ProductManagement
