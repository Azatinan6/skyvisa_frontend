import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { Lock, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Giriş mi Kayıt mı?
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // GİRİŞ YAPMA İSTEĞİ
        const response = await api.post('/auth/login', { email, password });
        login(response.data.token); // Token'ı Zustand'a ve LocalStorage'a kaydet
        navigate('/dashboard'); // Başarılıysa Panele yönlendir
      } else {
        // KAYIT OLMA İSTEĞİ
        const response = await api.post('/auth/register', { fullName, email, password });
        login(response.data.token);
        navigate('/login');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Bir hata oluştu. Bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="flex items-center justify-center mt-16">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          {isLogin ? 'Hoş Geldin' : 'Aramıza Katıl'}
        </h2>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Ad Soyad" value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input type="email" placeholder="E-posta Adresi" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-md">
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? 'Hesabın yok mu?' : 'Zaten üye misin?'}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-1 text-blue-600 font-bold hover:underline">
            {isLogin ? 'Hemen Kayıt Ol' : 'Giriş Yap'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;