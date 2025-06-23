import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function Account() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
    mobile: "",
  });
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
    mobile: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const uid = firebaseUser.uid;
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser({
              username: userData.username || "",
              email: userData.email || "",
              address: userData.address || "",
              city: userData.city || "",
              pincode: userData.pincode || "",
              state: userData.state || "",
              country: userData.country || "",
              mobile: userData.mobile || "",
            });
          }

          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
        setUser({
          username: "",
          email: "",
          address: "",
          city: "",
          pincode: "",
          state: "",
          country: "",
          mobile: "",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    const {
      username,
      email,
      password,
      address,
      city,
      pincode,
      state,
      country,
      mobile,
    } = form;

    if (!username || !email || !password) return;

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCred.user.uid;
      localStorage.setItem("uid", uid);

      const userData = {
        username,
        email,
        address,
        city,
        pincode,
        state,
        country,
        mobile,
        createdAt: serverTimestamp(),
        cart: [],
      };

      await setDoc(doc(db, "users", uid), userData);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Signup error:", error.message);
      alert("Signup failed: " + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = form;
    if (!email || !password) return;

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      localStorage.setItem("uid", uid);

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUser({
          username: userData.username || "User",
          email: userData.email || email,
          address: userData.address || "",
          city: userData.city || "",
          pincode: userData.pincode || "",
          state: userData.state || "",
          country: userData.country || "",
          mobile: userData.mobile || "",
        });
      }

      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setIsLoggedIn(false);
    setForm({
      username: "",
      email: "",
      password: "",
      address: "",
      city: "",
      pincode: "",
      state: "",
      country: "",
      mobile: "",
    });
    setUser({
      username: "",
      email: "",
      address: "",
      city: "",
      pincode: "",
      state: "",
      country: "",
      mobile: "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEdit = () => {
    setEditForm({ ...user });
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const uid = auth.currentUser.uid;
      await setDoc(
        doc(db, "users", uid),
        {
          ...editForm,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setUser(editForm);
      setIsEditing(false);
      alert("Information updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update info: " + error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;
        localStorage.setItem("uid", uid);
      } else {
        localStorage.removeItem("uid");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="account-wrapper">
        {isLoggedIn ? (
          <>
            <div className="account-card">
              <div className="user-info">
                <h2 className="account-heading">My Account</h2>
                <img
                  src={`https://ui-avatars.com/api/?name=${
                    user.username || "User"
                  }&background=0D8ABC&color=fff&size=128`}
                  alt="profile"
                  className="profile-pic"
                />
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Mobile:</strong> {user.mobile}
                </p>
                <p>
                  <strong>Address:</strong> {user.address}
                </p>
                <p>
                  <strong>City:</strong> {user.city}
                </p>
                <p>
                  <strong>Pincode:</strong> {user.pincode}
                </p>
                <p>
                  <strong>State:</strong> {user.state}
                </p>
                <p>
                  <strong>Country:</strong> {user.country}
                </p>
                <button className="ReBtn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
            <div className="account-card">
              <div className="edit-info">
                <h2 className="account-heading">Edit Info</h2>
                {isEditing ? (
                  <div className="edit-form">
                    {Object.entries(editForm).map(
                      ([key, value]) =>
                        key !== "email" && (
                          <div className="form-group" key={key}>
                            <label>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                            <input
                              type="text"
                              name={key}
                              value={value}
                              onChange={handleEditChange}
                            />
                          </div>
                        )
                    )}
                    <button className="BuyBtn" onClick={handleUpdate}>
                      Save Changes
                    </button>
                    <button
                      className="ReBtn"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <p>
                      <strong>Mobile:</strong> {user.mobile}
                    </p>
                    <p>
                      <strong>Address:</strong> {user.address}
                    </p>
                    <p>
                      <strong>City:</strong> {user.city}
                    </p>
                    <p>
                      <strong>Pincode:</strong> {user.pincode}
                    </p>
                    <p>
                      <strong>State:</strong> {user.state}
                    </p>
                    <p>
                      <strong>Country:</strong> {user.country}
                    </p>
                    <button className="ReBtn" onClick={handleEdit}>
                      Edit Info
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="account-card">
            <form
              onSubmit={isSignup ? handleSignup : handleLogin}
              className="auth-form"
            >
              {isSignup && (
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {isSignup && (
                <>
                  <div className="form-group">
                    <label>Mobile</label>
                    <input
                      type="text"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              <button type="submit" className="BuyBtn">
                {isSignup ? "Sign Up" : "Log In"}
              </button>

              <p className="toggle-link">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <span onClick={() => setIsSignup(!isSignup)}>Click here</span>
              </p>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
