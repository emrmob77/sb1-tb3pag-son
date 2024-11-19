import React, { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

function Auth() {
  const { signUp, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast.success("Kayıt başarılı! Lütfen email adresinizi doğrulayın.");
        setIsSignUp(false);
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success("Giriş başarılı!");
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message);
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
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email adresi"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
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