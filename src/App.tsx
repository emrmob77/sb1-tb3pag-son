import React from 'react';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookmarkForm from './components/BookmarkForm';
import BookmarkList from './components/BookmarkList';
import Auth from './components/Auth';
import { useBookmarks } from './hooks/useBookmarks';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { bookmarks, loading, addBookmark, deleteBookmark, updateBookmark } = useBookmarks();
  const [editingBookmark, setEditingBookmark] = React.useState(null);

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

  const handleEdit = (bookmark) => {
    setEditingBookmark(bookmark);
  };

  const handleUpdate = async (data) => {
    if (editingBookmark) {
      await updateBookmark(editingBookmark.id, data);
      setEditingBookmark(null);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookmarkIcon className="h-8 w-8 text-blue-600" />
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
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-medium text-gray-900">
                    {editingBookmark ? 'Yer İmini Düzenle' : 'Yeni Yer İmi Ekle'}
                  </h2>
                  <div className="mt-6">
                    <BookmarkForm
                      onSubmit={editingBookmark ? handleUpdate : addBookmark}
                      initialData={editingBookmark || undefined}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <Routes>
                <Route path="/" element={
                  <BookmarkList
                    bookmarks={bookmarks}
                    onEdit={handleEdit}
                    onDelete={deleteBookmark}
                    loading={loading}
                  />
                } />
                <Route path="/tag/:tag" element={
                  <BookmarkList
                    bookmarks={bookmarks}
                    onEdit={handleEdit}
                    onDelete={deleteBookmark}
                    loading={loading}
                  />
                } />
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