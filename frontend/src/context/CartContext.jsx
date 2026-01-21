import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState({ type: 'none', value: 0 });
  const [stockError, setStockError] = useState(null);

  const clearStockError = () => setStockError(null);

  const addItem = (product) => {
    setStockError(null);

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Check if adding one more would exceed stock
        if (existingItem.quantity + 1 > product.stock) {
          setStockError({
            productId: product.id,
            productName: product.name,
            availableStock: product.stock,
            message: `Only ${product.stock} items available for "${product.name}"`,
          });
          return prevItems; // Don't update
        }
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // New item - check if stock is available
      if (product.stock < 1) {
        setStockError({
          productId: product.id,
          productName: product.name,
          availableStock: product.stock,
          message: `"${product.name}" is out of stock`,
        });
        return prevItems;
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setStockError(null);

    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) => {
      const item = prevItems.find((i) => i.id === productId);

      if (item && quantity > item.stock) {
        setStockError({
          productId: item.id,
          productName: item.name,
          availableStock: item.stock,
          message: `Only ${item.stock} items available for "${item.name}"`,
        });
        return prevItems; // Don't update
      }

      return prevItems.map((i) =>
        i.id === productId ? { ...i, quantity } : i
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    setDiscount({ type: 'none', value: 0 });
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();

    if (discount.type === 'percentage') {
      return (subtotal * discount.value) / 100;
    } else if (discount.type === 'fixed') {
      return Math.min(discount.value, subtotal);
    }

    return 0;
  };

  const calculateTax = (taxRate = 0) => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const taxableAmount = subtotal - discountAmount;
    return (taxableAmount * taxRate) / 100;
  };

  const calculateTotal = (taxRate = 0) => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const tax = calculateTax(taxRate);
    return subtotal - discountAmount + tax;
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = {
    items,
    discount,
    stockError,
    setDiscount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    clearStockError,
    calculateSubtotal,
    calculateDiscount,
    calculateTax,
    calculateTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
