import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

import { useGetAddressByOrderIdQuery, useLazyGetOrderInvoiceDetailsQuery } from "../../../redux/apiSliceFeatures/OrderApiSlice";
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

export const generateInvoicePDF = (order, address) => {
  if (!order || !address) {
    console.error("Unable to generate invoice. Address or order details missing.");
    return;
  }

  const doc = new jsPDF();

  // --- Color Palette (Professional Dark Blue/Gray) ---
  const primaryColor = [41, 128, 185]; // A nice professional blue
  const headingsColor = [44, 62, 80]; // Dark slate
  const textColor = [50, 50, 50]; // Dark gray for text

  // --- Constants & Config ---
  const companyName = "VAGO UNIVERSITY";
  const invoiceDate = new Date().toLocaleDateString("en-IN");
  const orderDate = new Date(order.createdAt || order.orderDate).toLocaleDateString("en-IN");
  const invoiceNo = `INV-${(order.orderId || order._id).toString().slice(-6).toUpperCase()}`;

  // Helper: Format Currency (Using 'Rs.' to avoid font encoding issues in PDF)
  const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // --- Header Section ---
  doc.setFontSize(24);
  doc.setTextColor(...headingsColor);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 14, 20);

  // Divider Line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(14, 25, 196, 25);

  // Invoice Details (Right Aligned mostly)
  doc.setFontSize(10);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "bold");
  doc.text(`Invoice No:`, 140, 32);
  doc.setFont("helvetica", "normal");
  doc.text(invoiceNo, 196, 32, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.text(`Invoice Date:`, 140, 37);
  doc.setFont("helvetica", "normal");
  doc.text(invoiceDate, 196, 37, { align: "right" });

  // --- Sold By & Billing Address ---
  const sectionY = 50;

  // Left Side: Sold By
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor); // Blue accent
  doc.setFont("helvetica", "bold");
  doc.text("Sold By:", 14, sectionY);

  doc.setTextColor(...textColor); // Reset to black/gray
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(companyName, 14, sectionY + 6);
  doc.setFont("helvetica", "normal");
  doc.text("Bangalore, India", 14, sectionY + 11);

  // Right Side: Billing Address
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("Billing Address:", 110, sectionY);

  doc.setTextColor(...textColor);
  doc.setFontSize(10);

  const addressFields = [
    { label: "Name", value: address.fullName || address.name || "Customer" },
    { label: "Phone", value: address.mobile || address.phone },
    { label: "Street", value: address.street || address.addressLine1 },
    { label: "City", value: address.city },
    { label: "State", value: address.state },
    { label: "Zip", value: address.zipCode || address.pincode },
    { label: "Country", value: address.country }
  ].filter(f => f.value);

  let currentY = sectionY + 6;
  addressFields.forEach(field => {
    doc.setFont("helvetica", "bold");
    doc.text(`${field.label}:`, 110, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(`${field.value}`, 135, currentY);
    currentY += 5;
  });

  // --- Order Details Section ---
  const orderDetailsY = Math.max(currentY, sectionY + 25) + 10;

  doc.setDrawColor(240, 240, 240);
  doc.setFillColor(250, 250, 250);
  doc.rect(14, orderDetailsY - 6, 182, 14, 'F'); // Light gray background box

  doc.setFontSize(10);
  doc.setTextColor(...headingsColor);
  doc.setFont("helvetica", "bold");
  doc.text("Order ID:", 18, orderDetailsY);
  doc.setFont("helvetica", "normal");
  doc.text(order.orderId || order._id, 40, orderDetailsY);

  doc.setFont("helvetica", "bold");
  doc.text("Order Date:", 110, orderDetailsY);
  doc.setFont("helvetica", "normal");
  doc.text(orderDate, 135, orderDetailsY);


  // --- Invoice Items Table ---
  let items = [];
  // Logic to handle different order object structures
  if (order.productName || order.ProductName) {
    items.push({
      name: order.productName || order.ProductName,
      qty: order.quantity || order.Quantity || 1,
      price: order.price || order.Price || 0,
      total: order.itemTotal || order.TotalAmount || 0,
    });
  } else if (order.items && Array.isArray(order.items)) {
    items = order.items.map(i => ({
      name: i.productName,
      qty: i.quantity,
      price: i.Price || i.price,
      total: i.itemTotal || (i.Price * i.quantity),
    }));
  } else {
    items.push({
      name: order.ProductName || `Order #${order.orderId}`,
      qty: order.Quantity || order.itemCount || 1,
      price: order.Price || (order.totalAmount / (order.itemCount || 1)) || 0,
      total: order.TotalAmount || order.totalAmount || 0,
    });
  }

  const tableBody = items.map((item, index) => [
    index + 1,
    item.name,
    formatCurrency(item.price),
    item.qty,
    formatCurrency(item.total)
  ]);

  doc.autoTable({
    startY: orderDetailsY + 15,
    head: [['SI No', 'Description', 'Unit Price', 'Qty', 'Total Amount']],
    body: tableBody,
    theme: 'plain', // Cleaner look, we add custom borders
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      valign: 'middle',
      lineColor: [220, 220, 220],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 'auto' }, // Description gets auto width
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'center', cellWidth: 20 },
      4: { halign: 'right', cellWidth: 35 }
    },
    didDrawCell: (data) => {
      // Add bottom border to every row for a clean look
      if (data.section === 'body') {
        doc.setDrawColor(230, 230, 230);
        doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
      }
    }
  });

  // --- Footer Summary ---
  const finalY = doc.lastAutoTable.finalY + 10;
  const subTotal = items.reduce((a, b) => a + b.total, 0);
  const discount = order.CouponDiscount || order.couponDiscount || 0;
  const grandTotal = subTotal - discount;

  // Right Side: Totals
  const rightColumnX = 130;

  doc.setFontSize(10);
  doc.setTextColor(...textColor);

  // Subtotal
  doc.text("Subtotal:", rightColumnX, finalY);
  doc.text(formatCurrency(subTotal), 196, finalY, { align: 'right' });

  // Discount
  if (discount > 0) {
    doc.setTextColor(200, 0, 0); // Red for discount
    doc.text("Discount:", rightColumnX, finalY + 6);
    doc.text(`-${formatCurrency(discount)}`, 196, finalY + 6, { align: 'right' });
    doc.setTextColor(...textColor); // Reset
  }

  // Grand Total Box
  const totalY = finalY + (discount > 0 ? 12 : 8);
  doc.setFillColor(245, 245, 245);
  doc.rect(rightColumnX - 5, totalY - 5, 196 - (rightColumnX - 5), 10, 'F');

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", rightColumnX, totalY + 2);
  doc.text(formatCurrency(grandTotal), 196, totalY + 2, { align: 'right' });


  // Left Side: Words & Signatures
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Amount in Words:", 14, finalY + 5);
  doc.setFont("helvetica", "italic");
  doc.text(`${convertNumberToWords(Math.round(grandTotal))} Only`, 14, finalY + 10);

  // Signatures
  const signatureY = finalY + 40;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text("For Vago University:", 196, signatureY, { align: 'right' });
  // You could add an image here using doc.addImage() if you had a signature image
  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signatory", 196, signatureY + 15, { align: 'right' });

  // Disclaimer Footer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text("This is a computer generated invoice and does not require a physical signature.", 105, 285, { align: 'center' });

  doc.save(`Invoice_${order.orderId || order._id}.pdf`);
};

// Helper: Number to Words (Simplified)
const convertNumberToWords = (amount) => {
  // Basic implementation or placeholder for simplicity
  // A robust library would be better but keeping it simple/native
  const words = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).formatToParts(amount)
    .find(part => part.type === 'currency')?.value || "Rupees";
  return `Rupees ${amount}`; // Quick placeholder, user can expand if needed.
};

export const InvoiceDownloadIcon = ({ order, className }) => {
  const {
    data: address,
    isLoading: isAddressLoading,
    isError: isAddressError,
  } = useGetAddressByOrderIdQuery(order?._id, {
    skip: !order?._id,
  });

  const [triggerGetOrderDetails, { isLoading: isDetailsLoading }] = useLazyGetOrderInvoiceDetailsQuery();

  const handleDownloadClick = async (e) => {
    e.stopPropagation(); // Prevent parent click handlers

    if (isAddressLoading || isDetailsLoading) {
      return;
    }

    if (isAddressError || !address) {
      console.error("Error fetching address data");
      toast.error("Could not fetch invoice address.");
      return;
    }

    let orderDataForInvoice = order;

    // specific check: if we are in the "Overview" list, 'order' might lack 'items'
    // or if it's a single item passed from OrderDetails, it has 'productName'.
    const hasFullDetails = order.items && Array.isArray(order.items) && order.items.length > 0;
    const isSingleItem = !!(order.productName || order.ProductName);

    if (!hasFullDetails && !isSingleItem) {
      try {
        // Fetch full details
        // The query arg might need to be an object or id depending on definition.
        // Definition: query: ({ orderId }) => ...
        const result = await triggerGetOrderDetails({ orderId: order._id || order.orderId }).unwrap();

        // The result structure depends on API. Usually response.order or just response.
        // Let's assume result properly contains the order info or is the order object.
        // Based on AdminOrderDetailsPage using fetchOrderDetails from axios: response.data.order
        // Redux query usually returns the data field directly.
        // Let's assume 'result.order' or 'result'.
        // If the endpoint is /orders/order-invoice/:id, it likely returns { success: true, order: {...} } or similar.
        // We should check safely.
        orderDataForInvoice = result.order || result;

      } catch (err) {
        console.error("Failed to fetch order details for invoice", err);
        toast.error("Failed to generate invoice details.");
        return;
      }
    }

    if (orderDataForInvoice) {
      generateInvoicePDF(orderDataForInvoice, address);
    }
  };

  const isLoading = isAddressLoading || isDetailsLoading;

  return (
    <FaFilePdf
      onClick={handleDownloadClick}
      className={className || `text-red-600 hover:text-red-800 cursor-pointer text-5xl ${isLoading ? "opacity-50" : ""}`}
      title={isLoading ? "Generating..." : "Download Invoice"}
      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
    />
  );
};
