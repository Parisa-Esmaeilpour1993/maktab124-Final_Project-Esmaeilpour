export default function AdminLayout({ children }) {
  return (
    <div className="">
      <header className="">header</header>
      <div className="flex justify-between bg-red-200">
        <aside className="bg-green-200">
          <h2>Panel Admin</h2>
          <nav>
            <ul>
              <li>
                <a href="/admin/products">products</a>
              </li>
              <li>
                <a href="/admin/orders">orders</a>
              </li>
            </ul>
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
