import React from "react";
import "./CartModal.css";

const CartModal = ({ isOpen, onClose, cartItems, onUpdateQty, onRemove, onCheckout }) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <div className="cart-modal-header">
          <h3>Shopping Cart</h3>
          <span>{cartItems.length} items</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="cart-modal-body">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">${item.price.toFixed(2)}</div>
                  <div className="cart-item-qty">
                    <button onClick={() => onUpdateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                </div>
                <button className="cart-item-remove" onClick={() => onRemove(item.id)} title="Remove">
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
        <div className="cart-modal-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={onCheckout} disabled={cartItems.length === 0}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
