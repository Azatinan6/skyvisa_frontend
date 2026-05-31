import { create } from "zustand";

// Gelen uçuş verisinin tipini tanımlıyoruz (Backend'deki DTO'nun aynısı)
export interface Flight {
    destinationCountry: string;
    destinationCity: string;
    price: number;
    airline: string;
    visaStatus: string;
    imageUrl: string;
    destination: string;
}

// Depomuzun yapısı: Uçuşlar listesi, yükleniyor durumu ve bunları değiştiren fonksiyonlar
interface FlightStore {
    flights: Flight[];
    isLoading: boolean;
    setFlights: (flights: Flight[]) => void;
    setIsLoading: (loading: boolean) => void;
}

// Zustand ile depoyu yaratıyoruz
export const useFlightStore = create<FlightStore>((set) => ({
    flights: [],
    isLoading: false,
    setFlights: (flights) => set({ flights }),
    setIsLoading: (isLoading) => set({ isLoading }),
}));