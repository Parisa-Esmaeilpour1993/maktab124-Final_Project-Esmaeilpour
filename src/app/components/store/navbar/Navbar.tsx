import React from "react";

function Navbar() {
  return (
    <nav>
      <ul className="flex justify-center gap-20">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/products">Products</a>
        </li>
        <li>
          <a href="/cart">Cart</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
