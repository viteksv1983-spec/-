import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import React, { Suspense } from 'react';

// Layouts (always needed)
import PublicLayout from './components/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Critical path (Home is the landing page)
import Home from './components/Home';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './components/NotFound';

// SEO Group Routers (Strict Whitelist Validation)
import { GroupACategoryPage, GroupAProductPage } from './components/GroupARouter';
import { GroupBCategoryPage, GroupBProductPage } from './components/GroupBRouter';
import { GROUP_A_SLUGS, GROUP_B_SLUGS } from './constants/seoRoutes';

// Lazy-loaded routes (non-critical for initial paint)
const Login = React.lazy(() => import('./components/Login'));
const Register = React.lazy(() => import('./components/Register'));
const Cart = React.lazy(() => import('./components/Cart'));
const Promotions = React.lazy(() => import('./components/Promotions'));
const Delivery = React.lazy(() => import('./components/Delivery'));
const Fillings = React.lazy(() => import('./components/Fillings'));
const About = React.lazy(() => import('./components/About'));
const GalleryPhoto = React.lazy(() => import('./components/GalleryPhoto'));
const GalleryVideo = React.lazy(() => import('./components/GalleryVideo'));
const Reviews = React.lazy(() => import('./components/Reviews'));
const HolidayCakes = React.lazy(() => import('./components/HolidayCakes'));
const Blog = React.lazy(() => import('./components/Blog'));
const DistrictPage = React.lazy(() => import('./components/DistrictPage'));

// Admin (lazy — never needed on public pages)
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const Orders = React.lazy(() => import('./components/admin/Orders'));
const Products = React.lazy(() => import('./components/admin/Products'));
const ProductEdit = React.lazy(() => import('./components/admin/ProductEdit'));
const PageEditor = React.lazy(() => import('./components/admin/PageEditor'));
const CategoryManager = React.lazy(() => import('./components/admin/CategoryManager'));
const SEOPages = React.lazy(() => import('./components/admin/SEOPages'));
const TelegramSettings = React.lazy(() => import('./components/admin/TelegramSettings'));

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#A0153E] border-t-transparent rounded-full animate-spin" /></div>}>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />

                {/* ═══════════════════════════════════════════════
                  Group A: Occasion-based Catalog (Nested)
                  /torty-na-zamovlennya/
                  /torty-na-zamovlennya/:categorySlug/
                  /torty-na-zamovlennya/:categorySlug/:productSlug
                  ═══════════════════════════════════════════════ */}
                <Route path="/torty-na-zamovlennya" element={<HolidayCakes />} />
                {GROUP_A_SLUGS.map(slug => (
                  <Route key={`a-cat-${slug}`} path={`/torty-na-zamovlennya/${slug}`} element={<GroupACategoryPage categorySlug={slug} />} />
                ))}
                {GROUP_A_SLUGS.map(slug => (
                  <Route key={`a-prod-${slug}`} path={`/torty-na-zamovlennya/${slug}/:productSlug`} element={<GroupAProductPage categorySlug={slug} />} />
                ))}

                {/* ═══════════════════════════════════════════════
                  Group B: Type-based Independent Categories
                  /:categorySlug/
                  /:categorySlug/:productSlug
                  These MUST be declared AFTER all explicit system routes
                  to avoid conflicts.
                  ═══════════════════════════════════════════════ */}
                {/* System Pages (explicit — no conflicts with Group B) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/dostavka" element={<Delivery />} />
                <Route path="/nachynky" element={<Fillings />} />
                <Route path="/pro-nas" element={<About />} />
                <Route path="/foto" element={<GalleryPhoto />} />
                <Route path="/video" element={<GalleryVideo />} />
                <Route path="/vidguky" element={<Reviews />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/districts/:district" element={<DistrictPage />} />

                {/* Group B category and product explicit routes (Strict Whitelist) */}
                {GROUP_B_SLUGS.map(slug => (
                  <Route key={`b-cat-${slug}`} path={`/${slug}`} element={<GroupBCategoryPage categorySlug={slug} />} />
                ))}
                {GROUP_B_SLUGS.map(slug => (
                  <Route key={`b-prod-${slug}`} path={`/${slug}/:productSlug`} element={<GroupBProductPage categorySlug={slug} />} />
                ))}

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="orders" replace />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/new" element={<ProductEdit />} />
                  <Route path="products/edit/:id" element={<ProductEdit />} />
                  <Route path="seo" element={<PageEditor />} />
                  <Route path="categories" element={<CategoryManager />} />
                  <Route path="telegram" element={<TelegramSettings />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
