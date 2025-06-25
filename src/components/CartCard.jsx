export default function CartCard({ items, removeCart, handleBuyNow }) {
  return (
    <div className="Card">
      <img src={items.pic} alt={items.name} className="ProPic" />
      <h2>
        <p>Product: {items.name}</p>
        <p>RAM: {items.ram}</p>
        <p>Storage: {items.storage}</p>
        <p>Price: ₹{items.price}</p>
      </h2>
      <button className="BuyBtn" onClick={() => handleBuyNow(items)}>
        Buy Now
      </button>
      <button className="ReBtn" onClick={() => removeCart(items.name)}>
        Remove
      </button>
    </div>
  );
}
