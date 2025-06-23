import Cards from "./Cards";
import { useState } from "react";

export default function CardGroup({ data, cartItems, addToCart }) {
  const [searchterm, setSearchterm] = useState("");
  const [filRam, setFilRam] = useState("All RAM");
  const [filSto, setFilSto] = useState("All Storage");
  const [filSort, setFilSort] = useState("Newest First");
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSearch = (e) => {
    setSearchterm(e.target.value);
  };

  const handleRam = (e) => {
    setFilRam(e.target.value);
  };

  const handleSto = (e) => {
    setFilSto(e.target.value);
  };

  const handleSort = (e) => {
    setFilSort(e.target.value);
  };

  const searchItem = (items, searchterm) => {
    return items.name.toLowerCase().includes(searchterm.toLowerCase());
  };

  const selRam = (items, filRam) => {
    return (
      filRam === "All RAM" || items.ram.toLowerCase() === filRam.toLowerCase()
    );
  };

  const selSto = (items, filSto) => {
    return (
      filSto === "All Storage" ||
      items.storage.toLowerCase() === filSto.toLowerCase()
    );
  };

  const selSort = (items, filSort) => {
    const getNumericPrice = (price) => Number(String(price).replace(/,/g, ""));
    if (filSort === "Price: Low to High") {
      return [...items].sort(
        (a, b) => getNumericPrice(a.price) - getNumericPrice(b.price)
      );
    } else if (filSort === "Price: High to Low") {
      return [...items].sort(
        (a, b) => getNumericPrice(b.price) - getNumericPrice(a.price)
      );
    } else if (filSort === "⭐⭐⭐⭐ & up") {
      return [...items]
        .filter((item) => item.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating);
    } else {
      return items;
    }
  };

  const filteredItems = data.filter(
    (item) =>
      searchItem(item, searchterm) &&
      selRam(item, filRam) &&
      selSto(item, filSto)
  );

  const filteredData = selSort(filteredItems, filSort);

  return (
    <>
      <nav className="Nav-bar">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearch}
          value={searchterm}
          className="search-bar"
        />
        <div className="filter-bar">
          <div className="filter-slot">
            <label>RAM</label>
            <select className="filter-drop" value={filRam} onChange={handleRam}>
              <option>All RAM</option>
              <option>6GB</option>
              <option>8GB</option>
              <option>12GB</option>
            </select>
          </div>
          <div className="filter-slot">
            <label>Storage</label>
            <select className="filter-drop" value={filSto} onChange={handleSto}>
              <option>All Storage</option>
              <option>64GB</option>
              <option>128GB</option>
              <option>256GB</option>
            </select>
          </div>
          <div className="filter-slot">
            <label>Sort By</label>
            <select
              className="filter-drop"
              value={filSort}
              onChange={handleSort}
            >
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>⭐⭐⭐⭐ & up</option>
            </select>
          </div>
        </div>
      </nav>
      <ul className="Card-group">
        {filteredData.map((items) => (
          <Cards
            items={items}
            addToCart={addToCart}
            isAdded={cartItems.includes(items.name)}
            onClick={() => setSelectedItem(items)}
          />
        ))}
      </ul>
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedItem.pic} alt={selectedItem.name} />
            <div className="modal-details">
              <h2>{selectedItem.name}</h2>
              <p>
                <strong>Price:</strong> ₹{selectedItem.price}
              </p>
              <p>
                <strong>RAM:</strong> {selectedItem.ram}
              </p>
              <p>
                <strong>Storage:</strong> {selectedItem.storage}
              </p>
              <p>
                <strong>Description:</strong> {selectedItem.description}
              </p>
              <p>
                <strong>Rating: ⭐</strong> {selectedItem.rating}
              </p>
              <div>
                <button
                  className="BuyBtn"
                  onClick={() => {
                    setSelectedItem(null);
                  }}
                >
                  Buy Now
                </button>
                <button
                  className="AddBtn"
                  onClick={() => {
                    addToCart(selectedItem.name);
                    setSelectedItem(null);
                  }}
                  disabled={cartItems.includes(selectedItem.name)}
                >
                  Add to Cart
                </button>
                <button
                  className="CloBtn"
                  onClick={() => setSelectedItem(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
