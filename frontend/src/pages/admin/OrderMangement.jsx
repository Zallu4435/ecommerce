import { useState } from 'react'
import AdminTable from '../../components/admin/AdminTable'
import AdminSidebar from '../../components/admin/AdminSidebar';

const OrderManagement = () => {

    const [search, setSearch] = useState('');

    const orders = [
        {
          id: 1,
          name: "JohnDoe",
          productName: "Wireless Headphones",
          price: 120.99,
          quantity: 2,
          date: "2024-11-29",
          status: "Delivered",
          paymentMethod: "Credit Card",
          totalAmount: 241.98,
          address: "123 Elm Street, Springfield",
        },
        {
          id: 2,
          name: "JaneSmith",
          productName: "Gaming Laptop",
          price: 1500.0,
          quantity: 1,
          date: "2024-11-28",
          status: "Shipped",
          paymentMethod: "PayPal",
          totalAmount: 1500.0,
          address: "456 Oak Avenue, Shelbyville",
        },
        {
          id: 3,
          name: "AlexBrown",
          productName: "Smartphone Case",
          price: 15.49,
          quantity: 3,
          date: "2024-11-27",
          status: "Processing",
          paymentMethod: "Debit Card",
          totalAmount: 46.47,
          address: "789 Pine Road, Capital City",
        },
      ];      

  return (
    <div className='flex dark:bg-black space-x-12'>
        <AdminSidebar />

        <div className='dark:text-white my-12 text-gray-700 bg-orange-50 dark:bg-gray-900 px-10'>
            <h1 className="text-3xl font-bold ml-[-20px] my-6 text-gray-400">Order Management</h1>
            <AdminTable type="orders" data={orders} search={search} setSearch={setSearch} />  
        </div>    

    </div>
  )
}

export default OrderManagement
