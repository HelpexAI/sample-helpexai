export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  badge?: string; // e.g. "Bestseller", "Signature", "Hot", "New", "Family Pick", "Spicy", "Most Popular"
  imageUrl: string;
  isAvailable: boolean;
}

export interface StoreConfig {
  shopId: string;
  brandName: string;
  slogan: string;
  hotline: string;
  whatsappNumber: string; // E.g., "923000000000"
  selectedBranch: string;
  bannerNotice: string;
  currency: string;
  deliveryFee: number;
  categories: string[];
  items: MenuItem[];
  // Google Maps Clinic / Branch Embed
  showMapSection?: boolean;
  mapEmbedUrl?: string;
  mapTitle?: string;
  mapAddress?: string;
  mapTiming?: string;
}

export const defaultCheezious: StoreConfig = {
  shopId: "cheezious",
  brandName: "Cheezious",
  slogan: "Delivering Cheezy Khushiyan",
  hotline: "051-111-446-699",
  whatsappNumber: "+92 314 6517960",
  selectedBranch: "F-7 Markaz / Commercial Market / Blue Area",
  bannerNotice: "🔥 Delivering Cheezy Khushiyan across Islamabad & Rawalpindi!",
  currency: "Rs.",
  deliveryFee: 150,
  showMapSection: true,
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.895315802138!2d73.0538!3d33.7198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfbc385fb9d1%3A0x6b820a4be35ce675!2sCheezious%20F-7!5e0!3m2!1sen!2s!4v1709999999999!5m2!1sen!2s",
  mapTitle: "Visit Our Main Branch",
  mapAddress: "Shop 1-4, Block 13-E, Jinnah Super Market, F-7 Markaz, Islamabad",
  mapTiming: "Open Daily: 11:00 AM – 03:00 AM (Dine-in, Takeaway & Delivery)",
  categories: [
    "Special Pizza",
    "Somewhat Local",
    "Somewhat Sooper",
    "Burgers",
    "Sandwiches & Platters",
    "Starters",
    "Pasta",
    "Side Orders"
  ],
  items: [
    {
      id: "cz-1",
      name: "Crown Crust Pizza (Large)",
      category: "Special Pizza",
      description: "Our legendary pizza with mouth-watering crown filled with creamy cheese, kabab bites, and loaded chicken toppings.",
      price: 2050,
      originalPrice: 2250,
      badge: "Signature",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
      isAvailable: true
    },
    {
      id: "cz-2",
      name: "Stuff Crust Pizza (Regular)",
      category: "Special Pizza",
      description: "Crispy crust stuffed with rich melted cheese and selected herbs with spicy grilled chicken.",
      price: 1600,
      badge: "Bestseller",
      imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
      isAvailable: true
    },
    {
      id: "cz-3",
      name: "Bazinga Burger",
      category: "Burgers",
      description: "2 crispy fried boneless whole thigh fillets with signature secret sauce, lettuce, and cheese in a corn dusted bun.",
      price: 560,
      badge: "Most Popular",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      isAvailable: true
    },
    {
      id: "cz-4",
      name: "Bazinga Supreme Burger",
      category: "Burgers",
      description: "Massive double crispy chicken fillet loaded with jalapenos, melting cheese slice, and chili garlic mayo.",
      price: 860,
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
      isAvailable: true
    },
    {
      id: "cz-5",
      name: "Reggy Burger",
      category: "Burgers",
      description: "Crispy golden fried chicken patty paired with fresh lettuce and mayo in a toasted sesame seed bun.",
      price: 390,
      imageUrl: "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=600&auto=format&fit=crop&q=80",
      isAvailable: true
    },
    {
      id: "cz-6",
      name: "Chicken Tikka Pizza (Regular)",
      category: "Somewhat Local",
      description: "Traditional chicken tikka chunks, sliced red onions, bell peppers, and mozzarella cheese with spicy red sauce.",
      price: 1350,
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
      isAvailable: true
    },
    {
      id: "cz-7",
      name: "Chicken Fajita Pizza (Regular)",
      category: "Somewhat Local",
      description: "Authentic Mexican-fajita marinated chicken chunks, bell peppers, fresh onion, and heaps of mozzarella.",
      price: 1350,
      imageUrl: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&auto=format&fit=crop&q=80",
      isAvailable: true
    },
    {
      id: "cz-8",
      name: "Chicken Extreme Pizza (Regular)",
      category: "Somewhat Sooper",
      description: "Loaded combination of spicy chicken strips, onions, black olives, sweet corn, and extreme creamy sauce.",
      price: 1350,
      imageUrl: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80",
      isAvailable: true
    },
    {
      id: "cz-9",
      name: "Classic Roll Platter",
      category: "Sandwiches & Platters",
      description: "4 pieces of authentic Behari Rolls + 4 pieces of Arabic Rolls served with crispy golden fries and signature dip.",
      price: 1200,
      badge: "Family Pick",
      imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
      isAvailable: true
    },
    {
      id: "cz-10",
      name: "Flaming Wings (6 pcs)",
      category: "Starters",
      description: "6 crispy deep-fried chicken wings tossed in our fiery homemade spicy glaze.",
      price: 650,
      badge: "Spicy",
      imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80",
      isAvailable: true
    },
    {
      id: "cz-11",
      name: "Calzone Chunks (4 pcs)",
      category: "Starters",
      description: "4 golden-baked calzone pockets stuffed with fajita chicken, cheese, and sweet peppers served with fries.",
      price: 1150,
      imageUrl: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop&q=80",
      isAvailable: true
    },
    {
      id: "cz-12",
      name: "Crunchy Chicken Pasta",
      category: "Pasta",
      description: "Penne pasta in rich creamy Alfredo white sauce, baked with mozzarella cheese and topped with crispy fried chicken chunks.",
      price: 950,
      imageUrl: "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=600&auto=format&fit=crop&q=80",
      isAvailable: true
    },
    {
      id: "cz-13",
      name: "Cheezy Loaded Fries",
      category: "Side Orders",
      description: "Crispy crinkle-cut fries loaded with cheddar cheese sauce, jalapeno slices, and chicken chunks.",
      price: 450,
      imageUrl: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80",
      isAvailable: true
    }
  ]
};
