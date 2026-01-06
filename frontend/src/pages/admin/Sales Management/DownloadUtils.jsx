import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

import { useGetAddressByOrderIdQuery, useLazyGetOrderInvoiceDetailsQuery } from "../../../redux/apiSliceFeatures/OrderApiSlice";
import { FaFilePdf } from "react-icons/fa";

export const downloadSalesReportPDF = (
  dateRange,
  salesOverview,
  recentOrders,
  topProducts,
  topCategories,
  topBrands
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // --- Theme & Colors ---
  const primaryColor = [41, 128, 185]; // Blue
  const secondaryColor = [44, 62, 80]; // Dark Slate
  const grayColor = [120, 120, 120];
  const lightGray = [245, 245, 245];

  // --- Header Section ---
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("SALES REPORT", 14, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const timestamp = new Date().toLocaleString("en-IN", {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  doc.text(`Generated on: ${timestamp}`, pageWidth - 14, 25, { align: "right" });

  // --- Report Meta ---
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("VAGO UNIVERSITY", 14, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text("Bangalore, India", 14, 60);
  doc.text("support@vagouniversity.com", 14, 65);

  // Date Range
  let rangeText = "";
  if (recentOrders?.data?.dateRange?.start && recentOrders?.data?.dateRange?.end) {
    const start = new Date(recentOrders.data.dateRange.start).toLocaleDateString("en-IN");
    const end = new Date(recentOrders.data.dateRange.end).toLocaleDateString("en-IN");
    rangeText = `${start} - ${end}`;
  } else {
    rangeText = typeof dateRange === 'object' ? `${dateRange.start} - ${dateRange.end}` : dateRange;
  }

  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text("REPORT PERIOD:", pageWidth - 14, 55, { align: "right" });
  doc.setTextColor(0, 0, 0);
  doc.text(rangeText, pageWidth - 14, 61, { align: "right" });

  // --- 1. Executive Summary ---
  let currentY = 80;
  doc.setFontSize(14);
  doc.setTextColor(...secondaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("1. Executive Summary", 14, currentY);

  currentY += 10;
  const overviewData = [
    ["Total Revenue", `Rs. ${parseFloat(salesOverview?.totalRevenue || 0).toLocaleString('en-IN')}`],
    ["Total Orders", salesOverview?.totalOrders?.toLocaleString() || "0"],
    ["Total Discount Given", `Rs. ${parseFloat(salesOverview?.couponDiscount || 0).toLocaleString('en-IN')}`]
  ];

  doc.autoTable({
    startY: currentY,
    head: [["Metric", "Value"]],
    body: overviewData,
    theme: 'striped',
    headStyles: { fillColor: primaryColor, halign: 'left' },
    styles: { fontSize: 11, cellPadding: 6 },
    columnStyles: {
      0: { cellWidth: 100, fontStyle: 'bold', halign: 'left' },
      1: { cellWidth: 'auto', halign: 'left' }
    },
    margin: { left: 14, right: 14 } // Fixed: Use full width to prevent text wrapping
  });

  currentY = doc.lastAutoTable.finalY + 15;

  // --- 2. Top Selling Products (moved up) ---
  if (currentY + 60 > pageHeight) { doc.addPage(); currentY = 20; }

  doc.setFontSize(14);
  doc.setTextColor(...secondaryColor);
  doc.text("2. Product Performance", 14, currentY);

  const productData = (topProducts || []).map(p => [
    p._id || p.productName || "N/A",
    p.totalSold || 0,
    `Rs. ${parseFloat(p.totalRevenue || 0).toLocaleString('en-IN')}`
  ]);

  doc.autoTable({
    startY: currentY + 5,
    head: [["Product Name", "Units Sold", "Revenue"]],
    body: productData,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, halign: 'left' },
    columnStyles: {
      0: { halign: 'left' },
      1: { halign: 'left' },
      2: { halign: 'left' }
    }
  });

  currentY = doc.lastAutoTable.finalY + 15;

  // --- 3. Top Selling Categories (moved up) ---
  if (currentY + 60 > pageHeight) { doc.addPage(); currentY = 20; }

  if (topCategories && topCategories.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(...secondaryColor);
    doc.text("3. Category Performance", 14, currentY);

    const catData = topCategories.map(c => [
      c.categoryName || "N/A",
      c.totalItemsSold || 0,
      `Rs. ${parseFloat(c.totalRevenue || 0).toLocaleString('en-IN')}`
    ]);

    doc.autoTable({
      startY: currentY + 5,
      head: [["Category", "Items Sold", "Revenue"]],
      body: catData,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, halign: 'left' },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'left' },
        2: { halign: 'left' }
      }
    });
    currentY = doc.lastAutoTable.finalY + 15;
  }

  // --- 4. Top Selling Brands (moved up) ---
  if (currentY + 60 > pageHeight) { doc.addPage(); currentY = 20; }

  if (topBrands && topBrands.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(...secondaryColor);
    doc.text("4. Brand Performance", 14, currentY);

    const brandData = topBrands.map(b => [
      b.brandName || "N/A",
      b.totalItemsSold || 0,
      `Rs. ${parseFloat(b.totalRevenue || 0).toLocaleString('en-IN')}`
    ]);

    doc.autoTable({
      startY: currentY + 5,
      head: [["Brand", "Items Sold", "Revenue"]],
      body: brandData,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, halign: 'left' },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'left' },
        2: { halign: 'left' }
      }
    });
    currentY = doc.lastAutoTable.finalY + 15;
  }

  // --- 5. Order History (moved last) ---
  if (currentY + 60 > pageHeight) { doc.addPage(); currentY = 20; }

  doc.setFontSize(14);
  doc.setTextColor(...secondaryColor);
  doc.text("5. Order History", 14, currentY);

  const orderColumns = ["Order ID", "Date", "Customer", "Items", "Total (Rs.)", "Status"];
  const orderRows = (recentOrders?.data?.orders || []).map(order => [
    (order._id || "").toString().slice(-6).toUpperCase(),
    new Date(order.createdAt).toLocaleDateString("en-IN"),
    order.customer || "N/A",
    order.quantity || 0,
    parseFloat(order.total || 0).toLocaleString('en-IN'),
    order.status || "Pending"
  ]);

  doc.autoTable({
    startY: currentY + 5,
    head: [orderColumns],
    body: orderRows,
    theme: 'striped',
    headStyles: { fillColor: secondaryColor, halign: 'left' },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { halign: 'left' },
      1: { halign: 'left' },
      2: { halign: 'left' },
      3: { halign: 'left' },
      4: { halign: 'left' },
      5: { halign: 'left' }
    }
  });

  doc.save(`Sales_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const downloadSalesReportExcel = (
  dateRange,
  salesOverview,
  recentOrders,
  topProducts,
  topCategories,
  topBrands
) => {
  const workbook = XLSX.utils.book_new();

  const overviewData = [
    ["Metric", "Value"],
    ["Total Revenue", `₹${salesOverview?.totalRevenue?.toLocaleString() || 0}`],
    ["Total Orders", salesOverview?.totalOrders?.toLocaleString() || 0],
    [
      "Total Discount",
      `₹${salesOverview?.couponDiscount?.toLocaleString() || 0}`,
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
        product.productName || product._id || "N/A",
        product.totalSold || 0,
        `₹${product.totalRevenue?.toLocaleString() || 0}`,
      ])
      : []),
  ];
  const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
  productsSheet["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, productsSheet, "Top Products");

  const categories = topCategories || [];
  const categoriesData = [
    ["Category Name", "Total Items Sold", "Revenue"],
    ...(Array.isArray(categories)
      ? categories.map((cat) => [
        cat.categoryName || "N/A",
        cat.totalItemsSold || 0,
        `₹${cat.totalRevenue?.toLocaleString() || 0}`,
      ])
      : []),
  ];
  const categoriesSheet = XLSX.utils.aoa_to_sheet(categoriesData);
  categoriesSheet["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, categoriesSheet, "Top Categories");

  const brands = topBrands || [];
  const brandsData = [
    ["Brand Name", "Total Items Sold", "Revenue"],
    ...(Array.isArray(brands)
      ? brands.map((brand) => [
        brand.brandName || "N/A",
        brand.totalItemsSold || 0,
        `₹${brand.totalRevenue?.toLocaleString() || 0}`,
      ])
      : []),
  ];
  const brandsSheet = XLSX.utils.aoa_to_sheet(brandsData);
  brandsSheet["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, brandsSheet, "Top Brands");

  const fileTitle = `Sales Report - ${dateRange.type || dateRange}`;
  XLSX.writeFile(workbook, `${fileTitle}.xlsx`);
};

export const generateInvoicePDF = (order, address) => {
  if (!order || !address) {
    console.error("Unable to generate invoice. Address or order details missing.");
    return;
  }

  const doc = new jsPDF();

  // --- Constants & Colors ---
  const primaryColor = [41, 128, 185]; // Professional Blue
  const darkColor = [44, 62, 80]; // Dark Slate
  const grayColor = [100, 100, 100]; // Gray text
  const lightGray = [245, 245, 245]; // Backgrounds

  const companyName = "VAGO UNIVERSITY";
  const companyAddress = ["Bangalore, India", "support@vagouniversity.com"];
  const invoiceDate = new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' });
  const orderDate = new Date(order.createdAt || order.orderDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' });
  const invoiceNo = `INV-${(order.orderId || order._id).toString().slice(-6).toUpperCase()}`;

  // Helper: Format Currency
  const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // --- Header ---
  // Logo / Company Name Left
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(companyName.toUpperCase(), 14, 20);

  // INVOICE Title Right
  doc.setFontSize(28);
  doc.setTextColor(...lightGray); // Subtle backing text
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 140, 25);
  doc.setTextColor(...darkColor); // Main text
  doc.setFontSize(14);
  doc.text("INVOICE", 196, 25, { align: "right" });

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.line(14, 30, 196, 30);

  // --- Info Columns (Bill To | Order Details) ---
  const topY = 40;

  // -- Column 1: Bill To --
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO:", 14, topY);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(address.fullName || address.name || "Customer", 14, topY + 6);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  const addressLines = [
    address.mobile || address.phone,
    address.street || address.addressLine1,
    `${address.city}, ${address.state}`,
    `${address.zipCode || address.pincode}`,
    address.country
  ].filter(line => line); // Remove empty lines

  let addrY = topY + 11;
  addressLines.forEach(line => {
    doc.text(line, 14, addrY);
    addrY += 5;
  });

  // -- Column 2: Order Details --
  const col2X = 110;
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("ORDER DETAILS:", col2X, topY);

  const orderMeta = [
    { label: "Invoice No:", value: invoiceNo },
    { label: "Order ID:", value: `#${order.orderId || order._id}` },
    { label: "Order Date:", value: orderDate },
    { label: "Invoice Date:", value: invoiceDate },
    { label: "Status:", value: (order.Status || order.orderStatus || order.status || "Confirmed").toUpperCase() },
    { label: "Payment Method:", value: (order.paymentType || order.paymentMethod || "Online").toUpperCase() },
  ];

  doc.setFontSize(9);
  let metaY = topY + 6;
  orderMeta.forEach(item => {
    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "bold");
    doc.text(item.label, col2X, metaY);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(item.value, col2X + 35, metaY); // Fixed offset for values
    metaY += 5;
  });


  // --- Items Table ---
  // Normalize items
  let items = [];
  if (order.items && Array.isArray(order.items) && order.items.length > 0) {
    items = order.items.map(i => ({
      name: i.productName,
      qty: i.Quantity || i.quantity,
      price: i.Price || i.price || (i.itemTotal / (i.Quantity || i.quantity || 1)),
      total: i.itemTotal || ((i.Price || i.price) * (i.Quantity || i.quantity)),
      status: i.Status || i.status || order.orderStatus, // if individual item status exists
      reason: i.cancellationReason || i.returnReason || order.cancellationReason || order.returnReason
    }));
  } else if (order.productName || order.ProductName) {
    // Single item context
    items.push({
      name: order.productName || order.ProductName,
      qty: order.quantity || order.Quantity || 1,
      price: order.price || order.Price || 0,
      total: order.itemTotal || order.TotalAmount || 0,
      status: order.Status || order.status || order.orderStatus,
      reason: order.cancellationReason || order.returnReason
    });
  } else {
    // Fallback for list view objects lacking details
    items.push({
      name: `Order #${order.orderId}`,
      qty: order.itemCount || 1,
      price: order.totalAmount / (order.itemCount || 1),
      total: order.totalAmount,
    });
  }

  const tableBody = items.map((item, index) => {
    let description = item.name;
    if (item.status === "Cancelled" || item.status === "Returned" || item.status === "Return Requested") {
      description += ` (${item.status})`;
      if (item.reason) {
        description += `\nReason: ${item.reason}`;
      }
    }

    return [
      index + 1,
      description,
      formatCurrency(item.price),
      item.qty,
      formatCurrency(item.total)
    ];
  });

  doc.autoTable({
    startY: Math.max(addrY, metaY) + 10,
    head: [['#', 'Item Description', 'Unit Price', 'Qty', 'Total']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 3
    },
    styles: {
      fontSize: 9,
      valign: 'middle',
      cellPadding: 3,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'left' },
      1: { cellWidth: 'auto', halign: 'left' },
      2: { cellWidth: 30, halign: 'left' },
      3: { cellWidth: 15, halign: 'left' },
      4: { cellWidth: 30, halign: 'left' }
    },
    footStyles: {
      fillColor: lightGray,
      textColor: darkColor,
      fontStyle: 'bold'
    }
  });

  // --- Summary Footer ---
  const finalY = doc.lastAutoTable.finalY + 10;

  // Calculate totals
  const subTotal = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

  // Prefer specific fields for discount, fallback to difference if totals don't match
  const discount = order.couponDiscount || order.discountAmount || (order.subtotal && order.totalAmount ? order.subtotal - order.totalAmount : 0) || 0;

  // Safe grand total
  const grandTotal = order.totalAmount !== undefined ? parseFloat(order.totalAmount) : (subTotal - discount);

  const couponCode = order.couponCode ? ` (${order.couponCode})` : "";

  const rightColX = 130;
  const rightValX = 196;

  doc.setFontSize(10);

  // Subtotal
  doc.setTextColor(...grayColor);
  doc.text("Subtotal:", rightColX, finalY);
  doc.setTextColor(0, 0, 0);
  doc.text(formatCurrency(subTotal), rightValX, finalY, { align: "right" });

  // Discount
  if (discount > 0) {
    doc.setTextColor(220, 53, 69); // Red
    doc.text(`Discount${couponCode}:`, rightColX, finalY + 6);
    doc.text(`- ${formatCurrency(discount)}`, rightValX, finalY + 6, { align: "right" });
  }

  // Grand Total Background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(rightColX - 5, finalY + 12, (rightValX - rightColX) + 10, 10, 'F');

  // Grand Total Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", rightColX, finalY + 18.5);
  doc.text(formatCurrency(grandTotal), rightValX, finalY + 18.5, { align: "right" });


  // --- Bottom Footer ---
  const pageHeight = doc.internal.pageSize.height;

  // Amount in words
  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Amount in Words:", 14, finalY + 6);
  doc.setFont("helvetica", "italic");
  doc.text(`${convertNumberToWords(Math.round(grandTotal))} Only`, 14, finalY + 11);

  // Contact Info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.text("Thank you for your business!", 105, pageHeight - 20, { align: "center" });
  doc.text("support@vagouniversity.com  |  www.vagouniversity.com", 105, pageHeight - 15, { align: "center" });

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
