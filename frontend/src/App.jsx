import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Components
import Home from './components/Home';
import CakeDetail from './components/CakeDetail';
import CakesRouter from './components/CakesRouter';
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
              <Route path="/cakes" element={<CakeList />} />

              {/* SEO Category Routes */}
              <Route path="/bento-torty" element={<CakeList predefinedCategory="bento" predefinedSlug="bento-torty" />} />
              <Route path="/biskvitni-torty" element={<CakeList predefinedCategory="biscuit" predefinedSlug="biskvitni-torty" />} />
              <Route path="/musovi-torty" element={<CakeList predefinedCategory="mousse" predefinedSlug="musovi-torty" />} />
              <Route path="/vesilni-torty" element={<CakeList predefinedCategory="wedding" predefinedSlug="vesilni-torty" />} />
              <Route path="/kapkeyki" element={<CakeList predefinedCategory="cupcakes" predefinedSlug="kapkeyki" />} />
              <Route path="/imbirni-pryaniki" element={<CakeList predefinedCategory="gingerbread" predefinedSlug="imbirni-pryaniki" />} />

              {/* Holiday Subcategories Routes */}
              <Route path="/torty-na-den-narodzhennya" element={<CakeList predefinedCategory="birthday" predefinedSlug="torty-na-den-narodzhennya" />} />
              <Route path="/torty-na-yuviley" element={<CakeList predefinedCategory="anniversary" predefinedSlug="torty-na-yuviley" />} />
              <Route path="/dytyachi-torty" element={<CakeList predefinedCategory="kids" predefinedSlug="dytyachi-torty" />} />
              <Route path="/torty-dlya-khlopchykiv" element={<CakeList predefinedCategory="boy" predefinedSlug="torty-dlya-khlopchykiv" />} />
              <Route path="/torty-dlya-divchatok" element={<CakeList predefinedCategory="girl" predefinedSlug="torty-dlya-divchatok" />} />
              <Route path="/torty-dlya-zhinok" element={<CakeList predefinedCategory="for-women" predefinedSlug="torty-dlya-zhinok" />} />
              <Route path="/torty-dlya-cholovikiv" element={<CakeList predefinedCategory="for-men" predefinedSlug="torty-dlya-cholovikiv" />} />
              <Route path="/patriotychni-torty" element={<CakeList predefinedCategory="patriotic" predefinedSlug="patriotychni-torty" />} />
              <Route path="/torty-na-profesiyne-svyato" element={<CakeList predefinedCategory="professional" predefinedSlug="torty-na-profesiyne-svyato" />} />
              <Route path="/torty-gender-reveal-party" element={<CakeList predefinedCategory="gender-reveal" predefinedSlug="torty-gender-reveal-party" />} />
              <Route path="/torty-za-khobi" element={<CakeList predefinedCategory="hobby" predefinedSlug="torty-za-khobi" />} />
              <Route path="/korporatyvni-torty" element={<CakeList predefinedCategory="corporate" predefinedSlug="korporatyvni-torty" />} />
              <Route path="/torty-na-khrestyny" element={<CakeList predefinedCategory="christening" predefinedSlug="torty-na-khrestyny" />} />
              <Route path="/sezonni-torty" element={<CakeList predefinedCategory="seasonal" predefinedSlug="sezonni-torty" />} />
              <Route path="/foto-torty" element={<CakeList predefinedCategory="photo-cakes" predefinedSlug="foto-torty" />} />

              <Route path="/cakes/:categoryOrId" element={<CakesRouter />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/holiday" element={<HolidayCakes />} />
              <Route path="/fillings" element={<Fillings />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery/photo" element={<GalleryPhoto />} />
              <Route path="/gallery/video" element={<GalleryVideo />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/districts/:district" element={<DistrictPage />} />
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
