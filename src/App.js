import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import BookmarkList from './components/BookmarkList';
import BookmarkForm from './components/BookmarkForm';
import { useAuth } from './hooks/useAuth';
import { Bookmark } from 'lucide-react';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bookmark className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Yer İmleri
              </h1>
            </div>
            <button
              onClick={signOut}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Çıkış Yap
            </button>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BookmarkForm />
              </div>
            </div>

            <div className="lg:col-span-2">
              <Routes>
                <Route path="/" element={<BookmarkList />} />
                <Route path="/tag/:tag" element={<BookmarkList />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;