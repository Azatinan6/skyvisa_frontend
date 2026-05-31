import { useEffect, useState } from 'react';
import { PlaneTakeoff, Calendar, Wallet, Sparkles, Globe2, Compass } from 'lucide-react';
import api from '../services/api';
import { useFlightStore } from '../store/useFlightStore';
import FlightCard from '../components/FlightCard';
import { useAuthStore } from '../store/useAuthStore';

const HomePage = () => {
    const [origin, setOrigin] = useState('IST');
    const [date, setDate] = useState('2026-06-01');
    const [budget, setBudget] = useState('20000');
    const [onlyVisaFree, setOnlyVisaFree] = useState(false);

    const { flights, setFlights, setIsLoading, isLoading } = useFlightStore();
    const { isAuthenticated } = useAuthStore(); // Kullanıcı giriş yapmış mı?
    const [savedTrips, setSavedTrips] = useState<any[]>([]);

    useEffect(() => {
        if(isAuthenticated){
            api.get('/trips/myTrips')
               .then(res => setSavedTrips(res.data))
               .catch(err => console.error("Favoriler çekilemedi:", err));
        }
        else{
            setSavedTrips([]);
        }
    },[isAuthenticated, flights])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.get('/flights/search', {
                params: {
                    origin: origin,
                    date: date,
                    maxBudget: budget,
                    onlyVisaFree: onlyVisaFree
                }
            });
            setFlights(response.data);
        } catch (error) {
            console.error("Uçuşlar aranırken hata oluştu:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-slate-50 relative pb-24 overflow-hidden font-sans'>

            {/* İÇERİK (Z-index ile arka planın üstüne alıyoruz) */}
            <div className="relative z-10">

                {/* HERO SECTION (Başlık Alanı) */}
                <div className='text-center pt-6 pb-12 px-4'>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md text-blue-700 font-semibold text-sm mb-8 border border-blue-100 shadow-sm">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        Yapay Zeka Destekli Rota Bulucu
                    </div>
                    <h1 className='text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6'>
                        Rüyaları süsleyen <br />
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>
                            Tatil Planı
                        </span>
                    </h1>
                    <p className='text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium'>
                        Bütçeni ve vizeni dert etme. Kriterlerini belirle, yapay zeka senin için dünyadaki en kusursuz rotaları saniyeler içinde çıkarsın.
                    </p>
                </div>

                {/* ARAMA FORMU */}
                <div className='max-w-5xl mx-auto px-4'>
                    <div className='bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-white p-6 md:p-10'>
                        <form onSubmit={handleSearch} className='flex flex-col gap-8'>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

                                {/* Kalkış */}
                                <div className='group'>
                                    <label className='block text-sm font-bold text-slate-700 mb-2 ml-1 flex items-center gap-2'>
                                        <PlaneTakeoff className="w-4 h-4 text-blue-500" /> Kalkış
                                    </label>
                                    <div className='relative'>
                                        <input
                                            type="text"
                                            value={origin}
                                            onChange={(e) => setOrigin(e.target.value)}
                                            className='block w-full px-5 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-lg outline-none'
                                            placeholder='Örn: IST'
                                        />
                                    </div>
                                </div>

                                {/* Tarih */}
                                <div className="group">
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-500" /> Gidiş Tarihi
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="block w-full px-5 py-[14px] bg-slate-100/50 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-lg outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Bütçe */}
                                <div className="group">
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-blue-500" /> Maksimum Bütçe
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-2 flex items-center text-slate-400 font-bold">₺</span>
                                        <input
                                            type="number"
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                            className="block w-full px-5 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-lg outline-none"
                                            placeholder="15000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Alt Kısım: Filtre ve Buton */}
                            <div className="flex flex-col md:flex-row justify-between items-center pt-2 gap-6">

                                {/* Toggle Switch Tarzı Checkbox */}
                                <label className="flex items-center gap-4 cursor-pointer group bg-slate-100/50 hover:bg-slate-100 px-5 py-3 rounded-2xl transition-colors border border-slate-200">
                                    <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${onlyVisaFree ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                        <input
                                            type="checkbox"
                                            checked={onlyVisaFree}
                                            onChange={(e) => setOnlyVisaFree(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out shadow-sm ${onlyVisaFree ? 'transform translate-x-6' : ''}`}></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            Sadece Vizesiz <Globe2 className="w-4 h-4 text-emerald-500" />
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">Pasaportum var, vizem yok</span>
                                    </div>
                                </label>

                                {/* Premium Buton */}
                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-3">
                                    Rotaları Keşfet <Compass className="h-6 w-6" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Yükleniyor Animasyonu (Daha modern) */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center mt-20 gap-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-4 animate-spin"></div>
                        </div>
                        <p className="text-blue-600 font-bold animate-pulse">En iyi uçuşlar aranıyor...</p>
                    </div>
                )}

                {/* ARAMA SONUÇLARI */}
                {!isLoading && flights.length > 0 && (
                    <div className="mt-20 w-full max-w-7xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                                    Senin İçin Bulunan Rotalar
                                </h2>
                                <p className="text-slate-500 font-medium mt-2">Kriterlerine uyan en iyi fırsatlar listelendi.</p>
                            </div>
                            <div className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-xl border border-blue-200 shadow-sm">
                                {flights.length} Sonuç
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {flights.map((flight, index) => {
                                // KRİTİK KONTROL: Bu uçuş zaten favorilerde var mı?
                                const currentSavedTrip = savedTrips.find(
                                    trip => trip.destinationCountry?.name === flight.destinationCountry
                                );

                                return (
                                    <FlightCard 
                                        key={index} 
                                        flight={flight}
                                        // Kartlara başlangıç durumlarını yolluyoruz
                                        initialIsSaved={!!currentSavedTrip} 
                                        initialTripId={currentSavedTrip ? currentSavedTrip.id : null}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;