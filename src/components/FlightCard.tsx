import { useState, useEffect } from 'react'; // 1. useEffect EKLENDİ
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import type { Flight } from '../store/useFlightStore';
import { MapPin, Plane, CheckCircle, AlertTriangle, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

interface FlightCardProps {
  flight: Flight;
  initialIsSaved: boolean;
  initialTripId: number | null;
}

// 2. PROPLAR İÇERİ ALINDI
const FlightCard = ({ flight, initialIsSaved, initialTripId }: FlightCardProps) => {

  const { isAuthenticated } = useAuthStore();

  // 3. BAŞLANGIÇ DEĞERLERİ YUKARIDAN GELEN PROPLARA BAĞLANDI
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [tripId, setTripId] = useState<number | null>(initialTripId);

  // 4. SAYFA YENİLENMEDEN VERİLER GELDİĞİNDE KALPLERİ GÜNCELLEYECEK BLOK
  useEffect(() => {
    setIsSaved(initialIsSaved);
    setTripId(initialTripId);
  }, [initialIsSaved, initialTripId]);

  // Vize durumuna göre renk ve ikon belirleyen küçük bir yardımcı fonksiyon
  const getVisaBadge = (status?: string) => {
    const safeStatus = status ? status.trim().toUpperCase() : "";

    if (safeStatus === 'VİZESİZ' || safeStatus === 'VISA_FREE') {
      return { color: 'bg-emerald-500', icon: <CheckCircle className="w-4 h-4" />, text: 'Vizesiz' };
    }
    if (safeStatus === 'E-VİZE' || safeStatus === 'E_VISA') {
      return { color: 'bg-amber-500', icon: <AlertTriangle className="w-4 h-4" />, text: 'E-Vize' };
    }
    // Geri kalan Schengen veya Vize Gerekli durumları kırmızı basılacak
    return { color: 'bg-rose-500', icon: <AlertTriangle className="w-4 h-4" />, text: 'Vize Gerekli' };
  };

  const badge = getVisaBadge(flight.visaStatus);

  // TEK VE BİRLEŞTİRİLMİŞ AKILLI FONKSİYON
  const toggleSave = async () => {
    if (!isAuthenticated) {
      toast.error("İşlem yapmak için önce giriş yapmalısın!");
      return;
    }

    // EĞER ZATEN KAYITLIYSA SİL
    if (isSaved && tripId) {
      try {
        await api.delete(`/trips/${tripId}`);
        setIsSaved(false);
        setTripId(null);
        toast.success("Tatil favorilerden çıkarıldı!");
      } catch (error) {
        console.error("Silme hatası", error);
        toast.error("Silinirken bir hata oluştu.");
      }
    }
    // EĞER KAYITLI DEĞİLSE KAYDET
    else {
      try {
        const response = await api.post('/trips/save', flight);
        setIsSaved(true);
        // Backend'den dönen ID'yi state'e yazıyoruz ki silerken hangi ID'yi sileceğimizi bilelim
        setTripId(response.data?.id || 1);
        toast.success("Tatil başarıyla paneline kaydedildi!");
      } catch (error) {
        console.error("Kaydetme hatası", error);
        toast.error("Kaydedilirken bir hata oluştu.");
      }
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col h-full hover:-translate-y-2">

          {/* ÜST KISIM: Tam Ekran Resim ve Karartma Efekti */}
        <div className="relative h-64 w-full overflow-hidden">
          <img
           // Tekrar backend'in canlı linkine ve oradan gelen imageUrl verisine bağladık
            src={`https://skyvisa-api.onrender.com/images/${flight.destination}.jpg`}
            alt={flight.destination}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80";
            }}
          />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg backdrop-blur-md bg-opacity-90 ${badge.color}`}>
          {badge.icon}
          {badge.text}
        </div>

        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-bold tracking-tight">{flight.destinationCity}</h3>
          <div className="flex items-center gap-1 text-gray-200 text-sm mt-1">
            <MapPin className="w-4 h-4" />
            {flight.destinationCountry}
          </div>
        </div>
      </div>

      {/* ALT KISIM: Uçuş Detayları ve Fiyat */}
      <div className="p-4 flex justify-between items-end flex-grow bg-white">
        <div>
          <p className="text-sm text-gray-500 mb-1 flex items-center gap-1.5">
            <Plane className="w-4 h-4 text-gray-400" />
            Havayolu
          </p>
          <p className="font-semibold text-gray-900">{flight.airline}</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500 font-medium mb-1">Kişi başı başlangıç</p>
          <p className="text-2xl font-black text-blue-600">
            {flight.price.toLocaleString('tr-TR')} ₺
          </p>
        </div>

        <button
          onClick={toggleSave}
          className={`flex items-center gap-1 px-1 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${isSaved
            ? 'bg-rose-500 text-white shadow-md hover:bg-rose-600'
            : 'bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95'
            }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-white' : ''}`} />
          {isSaved ? 'Kaydedildi' : 'Kaydet'}
        </button>
      </div>

    </div>
  );
};

export default FlightCard;