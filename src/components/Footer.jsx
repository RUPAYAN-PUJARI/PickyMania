import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="Foot">
      <p className="foot-text">© {year} PickyMania, All rights reserved</p>
      <div className="foot-info">
        <a href="#">About us</a>
        <a href="#">Contact us</a>
        <a href="#">Help</a>
      </div>
    </footer>
  );
}
