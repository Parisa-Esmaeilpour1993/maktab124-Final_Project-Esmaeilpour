export default function StoreLayout({ children }) {
  return (
    <div>
      <header>
        <h1>Pharmacy Header</h1>
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
      </header>
      <main className="bg-red-300">{children}</main>
      <footer>Pharmacy Footer</footer>
    </div>
  );
}
