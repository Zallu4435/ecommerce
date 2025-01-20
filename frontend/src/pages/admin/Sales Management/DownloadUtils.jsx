import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

import { useGetAddressByOrderIdQuery } from "../../../redux/apiSliceFeatures/OrderApiSlice";
import { FaFilePdf } from "react-icons/fa";

export const downloadSalesReportPDF = (
  dateRange,
  salesOverview,
  recentOrders,
  topProducts
) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Sales Report", 14, 22);

  doc.setFontSize(12);
  doc.text(`Date Range: ${dateRange}`, 14, 30);

  doc.setFontSize(14);
  doc.text("Sales Overview", 14, 40);
  const overviewData = [
    ["Total Revenue", `₹${salesOverview?.totalRevenue?.toLocaleString() || 0}`],
    ["Total Orders", salesOverview?.totalOrders?.toLocaleString() || 0],
    [
      "Average Order Value",
      `₹${salesOverview?.averageOrderValue?.toLocaleString() || 0}`,
    ],
    ["Conversion Rate", `${salesOverview?.conversionRate || 0}%`],
  ];
  doc.autoTable({
    startY: 45,
    head: [["Metric", "Value"]],
    body: overviewData,
  });

  doc.setFontSize(14);
  doc.text("Recent Orders", 14, doc.lastAutoTable.finalY + 10);
  const orderData =
    recentOrders?.data?.orders?.map((order) => [
      order._id,
      order.customer || "N/A",
      order.quantity || 0,
      `₹${order.total?.toLocaleString() || 0}`,
      order.status,
    ]) || [];
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    head: [["Order ID", "Customer", "Quantity", "Total", "Status"]],
    body: orderData,
  });

  doc.setFontSize(14);
  doc.text("Top Selling Products", 14, doc.lastAutoTable.finalY + 10);
  const productData =
    topProducts?.map((product) => [
      product._id || "N/A",
      product.totalSold || 0,
      `₹${product.totalRevenue?.toLocaleString() || 0}`,
    ]) || [];
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    head: [["Product Name", "Total Sales", "Revenue"]],
    body: productData,
  });

  doc.save("sales_report.pdf");
};

export const downloadSalesReportExcel = (
  salesOverview,
  recentOrders,
  topProducts
) => {
  const workbook = XLSX.utils.book_new();

  const overviewData = [
    ["Metric", "Value"],
    ["Total Revenue", `₹${salesOverview?.totalRevenue?.toLocaleString() || 0}`],
    ["Total Orders", salesOverview?.totalOrders?.toLocaleString() || 0],
    [
      "Average Order Value",
      `₹${salesOverview?.averageOrderValue?.toLocaleString() || 0}`,
    ],
    ["Conversion Rate", `${salesOverview?.conversionRate || 0}%`],
  ];
  const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(workbook, overviewSheet, "Sales Overview");

  const ordersData = [
    ["Order ID", "Customer", "Quantity", "Total", "Status"],
    ...(recentOrders?.data?.orders?.map((order) => [
      order._id,
      order.customer || "N/A",
      order.quantity || 0,
      `₹${order.total?.toLocaleString() || 0}`,
      order.status,
    ]) || []),
  ];
  const ordersSheet = XLSX.utils.aoa_to_sheet(ordersData);
  XLSX.utils.book_append_sheet(workbook, ordersSheet, "Recent Orders");

  const productsData = [
    ["Product Name", "Total Sales", "Revenue"],
    ...(topProducts?.map((product) => [
      product._id || "N/A",
      product.totalSold || 0,
      `₹${product.totalRevenue?.toLocaleString() || 0}`,
    ]) || []),
  ];
  const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
  XLSX.utils.book_append_sheet(workbook, productsSheet, "Top Products");

  XLSX.writeFile(workbook, "sales_report.xlsx");
};


const generateInvoicePDF = (order, address) => {
  if (!order || !address) {
    console.error("Unable to generate invoice. Address or order details missing.");
    return;
  }

  const doc = new jsPDF();

  // Invoice Header
  doc.setFontSize(18);
  doc.text("Invoice", 14, 22);

  // Add Order Details
  doc.setFontSize(12);
  doc.text(`Order ID: ${order._id}`, 14, 30);
  doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 36);
  doc.text(`Status: ${order.Status}`, 14, 42);

  // Add Customer's Address
  doc.setFontSize(14);
  doc.text("Shipping Address", 14, 50);
  doc.setFontSize(12);
  doc.autoTable({
    startY: 55,
    head: [["Field", "Details"]],
    body: [
      ["Country", address?.country || "N/A"],
      ["State", address?.state || "N/A"],
      ["Street", address?.street || "N/A"],
      ["City", address?.city || "N/A"],
      ["Zip Code", address?.zipCode || "N/A"],
    ],
  });

  // Add Product Details
  doc.setFontSize(14);
  doc.text("Order Details", 14, doc.lastAutoTable.finalY + 10);
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    head: [["Product Name", "Quantity", "Price", "Total Amount"]],
    body: [
      [
        order.ProductName,
        order.Quantity,
        `₹${order.Price.toLocaleString()}`,
        `₹${order.TotalAmount.toLocaleString()}`,
      ],
    ],
  });

  // Add Total Amount
  const finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(14);
  doc.text("Total Amount", 14, finalY + 10);
  doc.setFontSize(12);
  doc.text(`Subtotal: ₹${order.Price.toLocaleString()}`, 14, finalY + 20);
  doc.text(`Offer Price: ₹${order.offerPrice.toLocaleString()}`, 14, finalY + 26);
  doc.text(`Total Amount: ₹${order.TotalAmount.toLocaleString()}`, 14, finalY + 32);

  // Footer
  doc.setFontSize(10);
  doc.text("Thank you for your purchase!", 14, finalY + 45);

  // Save PDF
  doc.save(`invoice_${order._id}.pdf`);
};

export const InvoiceDownloadIcon = ({ order }) => {
  const {
    data: address,
    isLoading,
    isError,
  } = useGetAddressByOrderIdQuery(order?._id, {
    skip: !order?._id,
  });

  const handleDownloadClick = () => {
    if (isLoading) {
      console.log("Loading address data...");
      return;
    }

    if (isError) {
      console.error("Error fetching address data");
      return;
    }

    if (address) {
      generateInvoicePDF(order, address);
    }
  };

  return (
    <FaFilePdf
      onClick={handleDownloadClick}
      className={`text-red-600 hover:text-red-800 cursor-pointer text-5xl ${
        isLoading ? 'opacity-50' : ''
      }`}
      title={isLoading ? "Loading..." : "Download PDF"}
      style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
    />
  );
};