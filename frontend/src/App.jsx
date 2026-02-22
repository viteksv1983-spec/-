import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Components
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Promotions from './components/Promotions';
import Delivery from './components/Delivery';
import Fillings from './components/Fillings';
import About from './components/About';
import GalleryPhoto from './components/GalleryPhoto';
import GalleryVideo from './components/GalleryVideo';
import Reviews from './components/Reviews';
import ScrollToTop from './components/ScrollToTop';
import HolidayCakes from './components/HolidayCakes';
import Blog from './components/Blog';
import DistrictPage from './components/DistrictPage';
import NotFound from './components/NotFound';

// SEO Group Routers (Strict Whitelist Validation)
import { GroupACategoryPage, GroupAProductPage } from './components/GroupARouter';
import { GroupBCategoryPage, GroupBProductPage } from './components/GroupBRouter';
import { GROUP_A_SLUGS, GROUP_B_SLUGS } from './constants/seoRoutes';

// Admin Components
import Orders from './components/admin/Orders';
import Products from './components/admin/Products';
import ProductEdit from './components/admin/ProductEdit';
import PageEditor from './components/admin/PageEditor';
import CategoryManager from './components/admin/CategoryManager';
import SEOPages from './components/admin/SEOPages';
import TelegramSettings from './components/admin/TelegramSettings';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
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
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/fillings" element={<Fillings />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery/photo" element={<GalleryPhoto />} />
              <Route path="/gallery/video" element={<GalleryVideo />} />
              <Route path="/reviews" element={<Reviews />} />
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
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
