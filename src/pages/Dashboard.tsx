import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
// Çöp kutusu ikonunu (Trash2) ekledik
import { MapPin, Wallet, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast'; // Şık bildirimler için

const DashboardPage = () => {
    const { isAuthenticated } = useAuthStore();
    const [myTrips, setMyTrips] = useState<any[]>([]);

    useEffect(() => {
        if (isAuthenticated) {
            api.get('/trips/myTrips')
                .then((res) => setMyTrips(res.data))
                .catch((err) => console.error(err));
        }
    }, [isAuthenticated]);

    // SİLME FONKSİYONU
    const handleDelete = async (tripId: number) => {
        try {
            await api.delete(`/trips/${tripId}`);
            // Başarılı olursa, silinen öğeyi ekrandan anında kaldır (Sayfayı yenilemeye gerek kalmadan)
            setMyTrips(myTrips.filter(trip => trip.id !== tripId));
            toast.success("Plan başarıyla silindi.");
        } catch (error) {
            console.error(error);
            toast.error("Silinirken bir hata oluştu.");
        }
    };

    if (!isAuthenticated) return <Navigate to="/login" />;

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Seyahat Planlarım</h1>
            </div>

            {myTrips.length === 0 ? (
                <div className="bg-white p-10 rounded-3xl text-center shadow-sm border border-gray-100">
                    <p className="text-gray-500">Henüz kaydedilmiş bir seyahat planın yok.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myTrips.map((trip) => (
                        <div key={trip.id} className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition group">

                            {/* KARTIN İÇERİĞİ */}
                            <div>
                                <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-500" />
                                    {trip.destinationCountry?.name || "Bilinmiyor"}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">Kayıtlı Plan</p>
                            </div>

                            <div className="text-right mr-8"> {/* Sil butonuna yer açmak için mr-8 ekledik */}
                                <div className="flex items-center gap-1 justify-end text-emerald-600 font-bold mb-1">
                                    <Wallet className="w-4 h-4" /> Bütçe
                                </div>
                                <span className="text-xl font-black text-gray-800">{trip.budget} ₺</span>
                            </div>

                            {/* SİL BUTONU (Mutlak pozisyonla sağ köşeye yerleşir, hover ile belirginleşir) */}
                            <button
                                onClick={() => handleDelete(trip.id)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all duration-200"
                                title="Planı Sil"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;