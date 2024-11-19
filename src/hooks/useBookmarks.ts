import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Tables } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export type Bookmark = Tables['bookmarks'];
export type BookmarkFormData = Omit<Bookmark, 'id' | 'user_id' | 'created_at'>;

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
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

      if (error) {
        if (error.message.includes('JWT')) {
          await supabase.auth.refreshSession();
          await fetchBookmarks();
          return;
        }
        throw error;
      }

      setBookmarks(data || []);
    } catch (error: any) {
      console.error('Error fetching bookmarks:', error);
      toast.error('Yer imleri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (data: BookmarkFormData) => {
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

      if (error) {
        if (error.message.includes('JWT')) {
          await supabase.auth.refreshSession();
          return addBookmark(data);
        }
        throw error;
      }

      await fetchBookmarks();
      toast.success('Yer imi eklendi');
    } catch (error: any) {
      console.error('Error adding bookmark:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const updateBookmark = async (id: string, data: BookmarkFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Giriş yapmanız gerekiyor');

      const { error } = await supabase
        .from('bookmarks')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        if (error.message.includes('JWT')) {
          await supabase.auth.refreshSession();
          return updateBookmark(id, data);
        }
        throw error;
      }

      await fetchBookmarks();
      toast.success('Yer imi güncellendi');
    } catch (error: any) {
      console.error('Error updating bookmark:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Giriş yapmanız gerekiyor');

      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        if (error.message.includes('JWT')) {
          await supabase.auth.refreshSession();
          return deleteBookmark(id);
        }
        throw error;
      }

      await fetchBookmarks();
      toast.success('Yer imi silindi');
    } catch (error: any) {
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