import data from "./readme.json";
import Header from "./components/Header";
import CardGroup from "./components/CardGroup";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import Account from "./components/Account";
import BuyNow from "./components/BuyNow";
import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./components/firebase";

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    if (storedUid) {
      setUid(storedUid);
      fetchCart(storedUid);
    }
  }, []);

  const fetchCart = async (storedUid) => {
    try {
      const userRef = doc(db, "users", storedUid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (Array.isArray(userData.cart)) {
          setCartItems(userData.cart);
        }
      }
    } catch (error) {
      console.error("Error fetching cart from Firestore:", error);
    }
  };

  const updateCartInFirestore = async (updatedCart) => {
    if (!uid) return;
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { cart: updatedCart });
    } catch (error) {
      console.error("Error updating cart in Firestore:", error);
    }
  };

  const addToCart = (item) => {
    setCartItems((prev) => {
      const updated = prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item];
      updateCartInFirestore(updated);
      return updated;
    });
  };

  const removeCart = (item) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i !== item);
      updateCartInFirestore(updated);
      return updated;
    });
  };

  const handleBuyNow = useCallback(
    (item) => {
      if (!uid) {
        console.error("UID not found. Cannot proceed to Buy Now.");
        return;
      }
      localStorage.setItem("selectedProduct", JSON.stringify(item));
      localStorage.setItem("uid", uid);
      window.location.href = "/BuyNow";
    },
    [uid]
  );

  return (
    <>
      <Header />
      <Router>
        <nav className="main-nav">
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="cart-link-container">
              <Link to="/Cart" className="nav-link">
                My Cart
                {cartItems.length > 0 && (
                  <span
                    className={`cart-badge ${
                      cartItems.length > 9 ? "double-digit" : ""
                    }`}
                  >
                    {Math.min(cartItems.length, 99)}
                    {cartItems.length > 99 && (
                      <span className="plus-icon">+</span>
                    )}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/Account" className="nav-link">
                My Account
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <CardGroup
                data={data}
                cartItems={cartItems}
                addToCart={addToCart}
                handleBuyNow={handleBuyNow}
              />
            }
          />
          <Route
            path="/Cart"
            element={
              <Cart
                data={data}
                cartItems={cartItems}
                removeCart={removeCart}
                handleBuyNow={handleBuyNow}
              />
            }
          />
          <Route path="/Account" element={<Account />} />
          <Route path="/BuyNow" element={<BuyNow />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}
