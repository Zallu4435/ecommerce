import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

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
