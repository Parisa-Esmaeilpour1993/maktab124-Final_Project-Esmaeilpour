export const links = [
  { href: "/admin", label: "🏠 داشبورد", id: "dashboard" },
  { href: "/admin/admins", label: "🛡️ ادمین‌ها", id: "admins" },
  { href: "/admin/users", label: "👥 کاربران", id: "users" },
  { href: "/admin/categories", label: "🗂️ دسته‌بندی‌ها", id: "categories" },
  { href: "/admin/products", label: "📦 محصولات", id: "products" },
  {
    href: "/admin/best-seller",
    label: "🔥 محصولات پرفروش",
    id: "best-seller",
  },
  {
    href: "/admin/offers",
    label: "💸 محصولات تخفیف‌دار",
    id: "offers",
  },
  {
    href: "/admin/newest-products",
    label: "🆕 جدیدترین محصولات",
    id: "newest-products",
  },
  {
    id: "public-pages",
    label: "🌐 صفحات عمومی",
    children: [
      {
        href: "/admin/pages/contactUs",
        label: "📞 تماس با ما",
        id: "contactUs",
      },
      { href: "/admin/pages/aboutUs", label: "📬 درباره ما", id: "aboutUs" },
      { href: "/admin/pages/terms", label: "✅ مجوزها", id: "terms" },
      {
        href: "/admin/pages/shoppingGuide",
        label: "📄  راهنمای خرید ",
        id: "shoppingGuide",
      },
    ],
  },
  { href: "/admin/sliders", label: "🖼️ بنرهای نمایشی", id: "sliders" },
  { href: "/admin/blogs", label: "📝 وبلاگ", id: "blogs" },
  {
    href: "/admin/deliveryMethods",
    label: "🚚 روش‌های ارسال",
    id: "deliveryMethods",
  },
];
