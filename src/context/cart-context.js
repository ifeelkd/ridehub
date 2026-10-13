"use client";

import { createContext, useContext, useReducer, useEffect, useCallback } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "ridehub_cart";

function loadCart() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Each cart item:
 * {
 *   productId, variantId (optional), productName, variantName,
 *   sku, price, salePrice, quantity, imageUrl, slug,
 *   brandName, maxStock
 * }
 */
function cartReducer(state, action) {
  let newState;

  switch (action.type) {
    case "INIT":
      return action.items;

    case "ADD": {
      const { item } = action;
      const key = item.variantId || item.productId;
      const existing = state.find(
        (i) => (i.variantId || i.productId) === key
      );

      if (existing) {
        const newQty = Math.min(
          existing.quantity + item.quantity,
          item.maxStock
        );
        newState = state.map((i) =>
          (i.variantId || i.productId) === key
            ? { ...i, quantity: newQty }
            : i
        );
      } else {
        newState = [...state, { ...item }];
      }
      break;
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action;
      if (quantity <= 0) {
        newState = state.filter((i) => (i.variantId || i.productId) !== id);
      } else {
        newState = state.map((i) =>
          (i.variantId || i.productId) === id
            ? { ...i, quantity: Math.min(quantity, i.maxStock) }
            : i
        );
      }
      break;
    }

    case "REMOVE": {
      newState = state.filter(
        (i) => (i.variantId || i.productId) !== action.id
      );
      break;
    }

    case "CLEAR":
      newState = [];
      break;

    default:
      return state;
  }

  saveCart(newState);
  return newState;
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    dispatch({ type: "INIT", items: loadCart() });
  }, []);

  const addItem = useCallback((item) => {
    dispatch({ type: "ADD", item });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", id, quantity });
  }, []);

  const removeItem = useCallback((id) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + (i.salePrice || i.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
