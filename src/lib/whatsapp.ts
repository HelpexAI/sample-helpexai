import { MenuItem, StoreConfig } from "@/data/defaultCheezious";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  orderType: "Delivery" | "Dine-In" | "Takeaway";
  address?: string;
  landmark?: string;
  tableNumber?: string;
  notes?: string;
}

export function formatPrice(amount: number, currency = "Rs."): string {
  return `${currency} ${amount.toLocaleString("en-PK")}`;
}

export function generateWhatsAppMessage({
  config,
  cartItems,
  customer,
}: {
  config: StoreConfig;
  cartItems: CartItem[];
  customer: CustomerDetails;
}): string {
  const subtotal = cartItems.reduce(
    (sum, ci) => sum + ci.item.price * ci.quantity,
    0
  );
  const deliveryFee = customer.orderType === "Delivery" ? config.deliveryFee : 0;
  const grandTotal = subtotal + deliveryFee;

  const itemLines = cartItems.map((ci) => {
    const itemTotal = formatPrice(ci.item.price * ci.quantity, config.currency);
    return `• ${ci.quantity}x ${ci.item.name} - ${itemTotal}`;
  });

  const divider = "----------------------------------------";

  let detailsBlock = `*Customer Name:* ${customer.name || "N/A"}\n*Phone:* ${
    customer.phone || "N/A"
  }\n*Order Type:* ${customer.orderType}`;

  if (customer.orderType === "Delivery") {
    const fullAddress = [customer.address, customer.landmark]
      .filter(Boolean)
      .join(", ");
    detailsBlock += `\n*Address:* ${fullAddress || "N/A"}`;
  } else if (customer.orderType === "Dine-In") {
    detailsBlock += `\n*Table Number:* ${customer.tableNumber || "N/A"}`;
  }

  if (customer.notes) {
    detailsBlock += `\n*Special Instructions:* ${customer.notes}`;
  }

  const message = `🍕 *NEW ORDER - ${config.brandName.toUpperCase()}*
${divider}
${itemLines.join("\n")}
${divider}
*Subtotal:* ${formatPrice(subtotal, config.currency)}
*Delivery Fee:* ${formatPrice(deliveryFee, config.currency)}
*Grand Total:* ${formatPrice(grandTotal, config.currency)}
${divider}
${detailsBlock}
${divider}
_Branch: ${config.selectedBranch}_`;

  return message;
}

export function getWhatsAppOrderUrl({
  config,
  cartItems,
  customer,
}: {
  config: StoreConfig;
  cartItems: CartItem[];
  customer: CustomerDetails;
}): string {
  // Clean phone number (strip leading +, spaces, dashes)
  const phone = (config.whatsappNumber || "923146517960").replace(/[^0-9]/g, "");
  const message = generateWhatsAppMessage({ config, cartItems, customer });
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}
