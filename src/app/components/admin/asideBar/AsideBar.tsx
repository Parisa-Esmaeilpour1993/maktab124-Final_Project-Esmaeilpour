export default function AdminSidebar({
  isOpen,
}: {
  isOpen: boolean;
  closeSidebar: () => void;
}) {
  return (
    <aside
      className={`bg-gradient-to-b from-slate-800 to-slate-100  text-white w-64 h-screen fixed top-0 right-0 md:static z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
      }`}
    ></aside>
  );
}
