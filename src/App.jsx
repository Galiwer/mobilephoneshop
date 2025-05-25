import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navibar from './components/Navibar';
import Footer from './components/Footer';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import './components/ErrorHandler.css';

import Home from './components/Home';
import Products from './components/Products';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import EnterNumberPage from './repair_tracking/enter_number_file/enter_number_page';
import DisplayProgressPage from './repair_tracking/display_progress_file/display_progress_page';
import ProgressUpdatePage from './repair_tracking/progress_update_file/progress_update_page';
import Aboutus from './components/Aboutus';
import Firmware from './components/Firmware';
import FAQList from './components/FAQList';
import FirmwareManager from './components/FirmwareManager';
import AdminFirmware from './components/AdminFirmware';
import AdminFAQList from './components/AdminFAQList';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';
import { isAuthenticated, isAdmin } from './services/UserService';
import UserManagementPage from './components/userspage/UserManagementPage';
import ProfilePage from './components/userspage/ProfilePage';
import UpdateUser from './components/userspage/UpdateUser';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import ErrorHandler from './components/ErrorHandler';

// Protected Route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    if (requireAdmin && !isAdmin()) {
        return <Navigate to="/" />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Navibar />
                <main className="main-content">
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/products' element={<Products />} />
                        <Route path='/product/:id' element={<ProductDetails />} />
                        <Route path='/repair' element={<EnterNumberPage />} />
                        <Route path='/repair_tracking/display_progress_file/display_progress_page' element={<DisplayProgressPage />} />
                        <Route path='/repair_tracking/progress_update_file/progress_update_page' element={
                            <ProtectedRoute requireAdmin={true}>
                                <ProgressUpdatePage />
                            </ProtectedRoute>
                        } />
                        <Route path='/aboutus' element={<Aboutus />} />
                        <Route path='/productlist' element={
                            <ProtectedRoute requireAdmin={true}>
                                <ProductList />
                            </ProtectedRoute>
                        } />
                        <Route path='/create-product' element={
                            <ProtectedRoute requireAdmin={true}>
                                <CreateProduct />
                            </ProtectedRoute>
                        } />
                        <Route path='/edit-product/:id' element={
                            <ProtectedRoute requireAdmin={true}>
                                <EditProduct />
                            </ProtectedRoute>
                        } />
                        <Route path='/firmware' element={<Firmware />} />
                        <Route path='/faq' element={<FAQList />} />
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/firmwaremanager' element={<FirmwareManager />} />
                        <Route path='/admin/firmware' element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminFirmware />
                            </ProtectedRoute>
                        } />
                        
                        {/* Protected Routes */}
                        <Route path='/profile' element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        } />
                        <Route path='/register' element={
                            <ProtectedRoute requireAdmin={true}>
                                <RegistrationPage />
                            </ProtectedRoute>
                        } />
                        <Route path='/admin/faq' element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminFAQList />
                            </ProtectedRoute>
                        } />
                        <Route path='/admin/user-management' element={
                            <ProtectedRoute requireAdmin={true}>
                                <UserManagementPage />
                            </ProtectedRoute>
                        } />
                        <Route path='/update-user/:userId' element={
                            <ProtectedRoute requireAdmin={true}>
                                <UpdateUser />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>
                <Footer />
                <ErrorHandler />
            </div>
        </BrowserRouter>
    );
}

export default App;
