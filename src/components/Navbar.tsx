import { Plane, User, LogOut } from 'lucide-react'; // LogOut ikonunu ekledik
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; // Zustand'ı import ettik

const Navbar = () => {
    // Kullanıcının giriş durumunu ve çıkış fonksiyonunu çekiyoruz
    const { isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Çıkış yapınca login ekranına yönlendir
    };

    return (
        <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo Kısmı (RüyaPlanner) */}
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <Plane className="h-8 w-8 text-blue-600" />
                        <span className="font-bold text-xl tracking-tight text-gray-900">
                            Rüya<span className="text-blue-600">Planner</span>
                        </span>
                    </Link>

                    {/* Sağ Taraf: Menüler ve Butonlar */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-gray-500 hover:text-gray-900 font-medium transition">
                            Uçuş Ara
                        </Link>

                        {/* DURUMA GÖRE BUTON DEĞİŞİMİ */}
                        {isAuthenticated ? (
                            // GİRİŞ YAPILDIYSA GÖRÜNECEKLER
                            <>
                                <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 font-medium transition">
                                    Favorilerim
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-5 py-2 rounded-full font-medium transition"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Çıkış Yap
                                </button>
                            </>
                        ) : (
                            // GİRİŞ YAPILMADIYSA GÖRÜNECEKLER
                            <Link to="/login" className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-full font-medium transition">
                                <User className="h-4 w-4" />
                                Giriş Yap
                            </Link>
                        )}

                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;