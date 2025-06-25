export default function Cards({
  items,
  addToCart,
  isAdded,
  onClick,
  handleBuyNow,
}) {
  return (
    <>
      <div className="Card">
        <div onClick={onClick} style={{ cursor: "pointer" }}>
          <img src={items.pic} alt={items.name} className="ProPic" />
          <h2>
            <p>Product: {items.name}</p>
            <p>RAM: {items.ram}</p>
            <p>Storage: {items.storage}</p>
            <p>Price: ₹{items.price}</p>
          </h2>
        </div>
        <button className="BuyBtn" onClick={() => handleBuyNow(items)}>
          Buy Now
        </button>
        <button
          className="AddBtn"
          onClick={() => addToCart(items.name)}
          disabled={isAdded}
        >
          Add to Cart
        </button>
      </div>
    </>
  );
}
