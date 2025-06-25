import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function BuyNow() {
  const [userData, setUserData] = useState(null);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    const productString = localStorage.getItem("selectedProduct");

    if (!uid || !productString) {
      console.error("Missing UID or selected product in localStorage.");
      return;
    }

    let parsedProduct;
    try {
      parsedProduct = JSON.parse(productString);
    } catch (err) {
      console.error("Error parsing product from localStorage:", err);
      return;
    }

    setProductData(parsedProduct);

    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.error("User not found.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUser();
  }, []);

  if (!userData || !productData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="buy-now-page">
      <h1 className="buy-now-title">Buy Now</h1>

      <div className="buy-now-details">
        <div className="product-image-container">
          <img src={productData.pic} alt={productData.name} />
        </div>

        <div className="info-section">
          <h2>Product Details</h2>
          <p>
            <strong>Name:</strong> {productData.name}
          </p>
          <p>
            <strong>Price:</strong> ₹{productData.price}
          </p>
          <p>
            <strong>RAM:</strong> {productData.ram}
          </p>
          <p>
            <strong>Storage:</strong> {productData.storage}
          </p>

          <h2>Shipping Information</h2>
          <p>
            <strong>Name:</strong> {userData.username}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Address:</strong> {userData.address}, {userData.city},{" "}
            {userData.state} - {userData.pincode}
          </p>
          <p>
            <strong>Country:</strong> {userData.country}
          </p>
          <p>
            <strong>Phone:</strong> {userData.mobile}
          </p>

          <button className="pay-btn">Pay with PayPal</button>
        </div>
      </div>
    </div>
  );
}
