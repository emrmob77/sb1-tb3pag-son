import React, { useState } from "react";
import { Loader2, Mail, Lock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../lib/supabase";

function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}`,
            data: {
              email
            }
          }
        });
        
        if (error) {
          if (error.message === 'Email address not authorized') {
            throw new Error('Lütfen geçerli bir email adresi kullanın');
          }
          throw error;
        }

        if (!data?.user) {
          throw new Error('Kayıt işlemi başarısız oldu');
        }

        if (data.user.identities?.length === 0) {
          throw new Error('Bu email adresi zaten kullanılıyor');
        }

        toast.success("Kayıt başarılı! Lütfen email adresinizi doğrulayın.");
        setIsSignUp(false); // Switch to login view
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            throw new Error('Lütfen önce email adresinizi doğrulayın');
          }
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Email veya şifre hatalı');
          }
          throw error;
        }

        toast.success("Giriş başarılı!");
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isSignUp ? "Hesap Oluştur" : "Giriş Yap"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp ? "Zaten hesabınız var mı?" : "Hesabınız yok mu?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isSignUp ? "Giriş yapın" : "Kayıt olun"}
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email adresi
              </label>
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email adresi"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Şifre
              </label>
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Şifre"
                minLength={6}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isSignUp ? (
                "Kayıt Ol"
              ) : (
                "Giriş Yap"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Auth;