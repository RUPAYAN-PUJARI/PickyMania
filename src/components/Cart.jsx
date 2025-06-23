import CartCard from "./CartCard";
export default function Cart({ data, cartItems, removeCart }) {
  return (
    <div className="cart-container">
      <div className="cart-head">
        <h2>My Cart</h2>
      </div>
      {cartItems.length === 0 ? (
        <div>
          <h3>Cart is Empty</h3>
        </div>
      ) : (
        cartItems.map((name) => {
          const item = data.find((item) => item.name === name);
          return <CartCard items={item} removeCart={removeCart} />;
        })
      )}
    </div>
  );
}
