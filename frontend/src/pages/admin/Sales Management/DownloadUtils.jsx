import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

import { useGetAddressByOrderIdQuery } from "../../../redux/apiSliceFeatures/OrderApiSlice";
import { FaFilePdf } from "react-icons/fa";
import LoadingSpinner from "../../../components/LoadingSpinner";

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
    [
      "Total Discount",
      `${salesOverview?.couponDiscount?.toLocaleString() || 0}`,
    ],
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
      order._id || "N/A",
      order.customer || "N/A",
      order.quantity || 0,
      `₹${order.total?.toLocaleString() || 0}`,
      order.paymentType || "N/A",
      `₹${order.discountAmount?.toLocaleString() || 0}`,
      order.status || "N/A",
    ]) || [];
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    head: [
      [
        "Order ID",
        "Customer",
        "Quantity",
        "Total",
        "Payment Type",
        "Discount Amount",
        "Status",
      ],
    ],
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
  dateRange,
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
    [
      "Total Discount",
      `${salesOverview?.couponDiscount?.toLocaleString() || 0}`,
    ],
  ];
  const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
  overviewSheet["!cols"] = [{ wch: 20 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(workbook, overviewSheet, "Sales Overview");

  const orders = recentOrders?.data?.orders || [];
  const ordersData = [
    [
      "Order ID",
      "Customer",
      "Quantity",
      "Total",
      "Payment Type",
      "Discount Amount",
      "Status",
    ],
    ...(Array.isArray(orders)
      ? orders.map((order) => [
          order._id || "N/A",
          order.customer || "N/A",
          order.quantity || 0,
          `₹${order.total?.toLocaleString() || 0}`,
          order.paymentType || "N/A",
          `₹${order.discountAmount?.toLocaleString() || 0}`,
          order.status || "N/A",
        ])
      : []),
  ];
  const ordersSheet = XLSX.utils.aoa_to_sheet(ordersData);
  ordersSheet["!cols"] = [
    { wch: 20 },
    { wch: 25 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
  ];
  XLSX.utils.book_append_sheet(workbook, ordersSheet, "Recent Orders");

  const products = topProducts || [];
  const productsData = [
    ["Product Name", "Total Sales", "Revenue"],
    ...(Array.isArray(products)
      ? products.map((product) => [
          product.productName || "N/A",
          product.totalSold || 0,
          `₹${product.totalRevenue?.toLocaleString() || 0}`,
        ])
      : []),
  ];
  const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
  productsSheet["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, productsSheet, "Top Products");

  const fileTitle = `Sales Report - ${dateRange.type} (${dateRange.start} to ${dateRange.end})`;
  XLSX.writeFile(workbook, `${fileTitle}.xlsx`);
};

const generateInvoicePDF = (order, address) => {
  if (!order || !address) {
    console.error("Unable to generate invoice. Address or order details missing.")
    return
  }

  const doc = new jsPDF()

  // Use a Unicode-compatible font
  doc.addFont(
    "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    "Roboto",
    "normal",
  )
  doc.setFont("Roboto")

  // Helper function to format currency
  const formatCurrency = (amount) => {
    const formattedAmount = amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
    return `\u20B9${formattedAmount}` 
  }

  // Invoice Header
  doc.setFontSize(18)
  doc.text("Invoice", 14, 22)

  // Add Order Details
  doc.setFontSize(12)
  doc.text(`Order ID: ${order._id}`, 14, 30)
  doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 36)
  doc.text(`Status: ${order.Status}`, 14, 42)

  // Add Customer's Address
  doc.setFontSize(14)
  doc.text("Shipping Address", 14, 50)
  doc.setFontSize(12)
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
    margin: { left: 14, top: 10 }, 
  })

  // Add Product Details
  doc.setFontSize(14)
  doc.text("Order Details", 14, doc.lastAutoTable.finalY + 10)
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    theme: "grid",
    headStyles: { fillColor: [66, 66, 66], fontSize: 12, fontStyle: "bold" },
    bodyStyles: { fontSize: 11 },
    columnStyles: {
      0: { cellWidth: 80 }, 
      1: { cellWidth: 30, halign: "center" }, 
      2: { cellWidth: 40, halign: "center" }, 
      3: { cellWidth: 40, halign: "center" }, 
    },
    head: [["Product Name", "Quantity", "Price", "Total Amount"]],
    body: [[order.ProductName, order.Quantity, order.Price, order.TotalAmount]],
    margin: { left: 14, top: 10 }, 
  })

  // Add Total Amount
  const finalY = doc.lastAutoTable.finalY
  doc.setFontSize(14)
  doc.text("Total Amount", 14, finalY + 10)
  doc.setFontSize(12)
  doc.text(`Subtotal: ${formatCurrency(order.Price)}`, 14, finalY + 20)
  doc.text(`Offer Price: ${formatCurrency(order.offerPrice)}`, 14, finalY + 26)
  doc.text(`Total Amount: ${formatCurrency(order.TotalAmount)}`, 14, finalY + 32)

  // Footer
  doc.setFontSize(10)
  doc.text("Thank you for your purchase!", 14, finalY + 45)

  // Save PDF
  doc.save(`invoice_${order._id}.pdf`)
}

export const InvoiceDownloadIcon = ({ order }) => {
  const {
    data: address,
    isLoading,
    isError,
  } = useGetAddressByOrderIdQuery(order?._id, {
    skip: !order?._id,
  })

  const handleDownloadClick = () => {
    if (isLoading) {
      return
    }

    if (isError) {
      console.error("Error fetching address data")
      return
    }

    if (address) {
      generateInvoicePDF(order, address)
    }
  }

  return (
    <FaFilePdf
      onClick={handleDownloadClick}
      className={`text-red-600 hover:text-red-800 cursor-pointer text-5xl ${isLoading ? "opacity-50" : ""}`}
      title={isLoading ? "Loading..." : "Download PDF"}
      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
    />
  )
}
