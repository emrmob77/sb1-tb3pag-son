import React, { useState } from 'react';
import { X, Plus, Loader2, RefreshCw, Lock, Unlock } from 'lucide-react';
import { BookmarkFormData } from '../hooks/useBookmarks';
import toast from 'react-hot-toast';

interface Props {
  onSubmit: (data: BookmarkFormData) => Promise<void>;
  initialData?: BookmarkFormData;
}

export default function BookmarkForm({ onSubmit, initialData }: Props) {
  const [loading, setLoading] = useState(false);
  const [fetchingMetadata, setFetchingMetadata] = useState(false);
  const [formData, setFormData] = useState<BookmarkFormData>(
    initialData || {
      url: '',
      title: '',
      description: '',
      tags: [],
      is_public: true,
    }
  );
  const [tagInput, setTagInput] = useState('');

  const fetchMetadata = async (url: string) => {
    setFetchingMetadata(true);
    try {
      const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (data.status === 'success') {
        setFormData(prev => ({
          ...prev,
          title: data.data.title || prev.title,
          description: data.data.description || prev.description,
        }));
        toast.success('Meta veriler başarıyla alındı');
      }
    } catch (error) {
      toast.error('Meta veriler alınamadı');
    } finally {
      setFetchingMetadata(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      if (!initialData) {
        setFormData({ url: '', title: '', description: '', tags: [], is_public: true });
      }
      toast.success('Yer imi kaydedildi!');
    } catch (error) {
      toast.error('Yer imi kaydedilemedi');
    }
    setLoading(false);
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">URL</label>
        <div className="mt-1 flex gap-2">
          <input
            type="url"
            value={formData.url}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, url: e.target.value }));
              if (e.target.value && !initialData) {
                fetchMetadata(e.target.value);
              }
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://example.com"
            required
          />
          <button
            type="button"
            onClick={() => formData.url && fetchMetadata(formData.url)}
            disabled={fetchingMetadata || !formData.url}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${fetchingMetadata ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Başlık</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Site Başlığı"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Açıklama</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          placeholder="Site Açıklaması"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Etiketler</label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Etiket ekle"
          />
          <button
            type="button"
            onClick={addTag}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, is_public: !prev.is_public }))}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
            formData.is_public
              ? 'text-green-700 bg-green-100 hover:bg-green-200'
              : 'text-red-700 bg-red-100 hover:bg-red-200'
          }`}
        >
          {formData.is_public ? (
            <>
              <Unlock className="h-4 w-4" />
              Herkese Açık
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Özel
            </>
          )}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          'Kaydet'
        )}
      </button>
    </form>
  );
}