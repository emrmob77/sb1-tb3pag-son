import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .or(`user_id.eq.${user.id},is_public.eq.true`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast.error('Yer imleri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Giriş yapmanız gerekiyor');

      const { error } = await supabase.from('bookmarks').insert([
        {
          ...data,
          user_id: user.id,
          created_at: new Date().toISOString(),
        }
      ]);

      if (error) throw error;
      await fetchBookmarks();
      toast.success('Yer imi eklendi');
    } catch (error) {
      console.error('Error adding bookmark:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const updateBookmark = async (id, data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Giriş yapmanız gerekiyor');

      const { error } = await supabase
        .from('bookmarks')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchBookmarks();
      toast.success('Yer imi güncellendi');
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const deleteBookmark = async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Giriş yapmanız gerekiyor');

      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchBookmarks();
      toast.success('Yer imi silindi');
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      toast.error(error.message);
    }
  };

  return {
    bookmarks,
    loading,
    addBookmark,
    updateBookmark,
    deleteBookmark,
  };
}