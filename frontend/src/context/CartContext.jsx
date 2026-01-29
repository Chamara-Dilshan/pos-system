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
      const unit = product.unit || 'pcs';
      const unitType = product.unit_type || 'piece';

      if (existingItem) {
        // For piece items, increment by 1 (current behavior)
        if (unitType === 'piece') {
          const newQuantity = existingItem.quantity + 1;
          if (newQuantity > product.stock) {
            setStockError({
              productId: product.id,
              productName: product.name,
              availableStock: product.stock,
              message: `Only ${product.stock} ${unit} available for "${product.name}"`,
            });
            return prevItems;
          }
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        // For weight/volume items, show message that item is already in cart
        setStockError({
          productId: product.id,
          productName: product.name,
          availableStock: product.stock,
          message: `"${product.name}" is already in cart. Update quantity in the cart.`,
        });
        return prevItems;
      }

      // New item - check if stock is available
      if (product.stock <= 0) {
        setStockError({
          productId: product.id,
          productName: product.name,
          availableStock: product.stock,
          message: `"${product.name}" is out of stock`,
        });
        return prevItems;
      }

      // Add new item with initial quantity: 1 for pieces, 0 for weight/volume (user will enter manually)
      const initialQuantity = unitType === 'piece' ? 1 : 0;
      return [...prevItems, { ...product, quantity: initialQuantity }];
    });
  };

  const removeItem = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setStockError(null);

    // Parse as float and round to 2 decimal places for precision
    const qty = Math.round(parseFloat(quantity) * 100) / 100;

    // Handle invalid input
    if (isNaN(qty) || qty < 0) {
      return;
    }

    // Remove item if quantity is 0
    if (qty === 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) => {
      const item = prevItems.find((i) => i.id === productId);

      if (item && qty > item.stock) {
        const unit = item.unit || 'pcs';
        setStockError({
          productId: item.id,
          productName: item.name,
          availableStock: item.stock,
          message: `Only ${item.stock} ${unit} available for "${item.name}"`,
        });
        return prevItems;
      }

      return prevItems.map((i) =>
        i.id === productId ? { ...i, quantity: qty } : i
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
