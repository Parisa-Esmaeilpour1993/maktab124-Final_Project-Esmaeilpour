import { LayoutProps } from "../types/layout";

export default function AdminLayout({ children }: LayoutProps) {
  return (
    <div className="">
      <header className="">header</header>
      <div className="flex">
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
        <main className="flex-1 flex justify-center items-center">
          {children}
        </main>
      </div>
    </div>
  );
}
