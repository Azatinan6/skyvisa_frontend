import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
          },
        }} 
      />

      {/* Sayfa İçerikleri Buraya Gelecek */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path='' element={<HomePage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;