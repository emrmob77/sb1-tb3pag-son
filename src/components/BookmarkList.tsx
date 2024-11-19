import React, { useState } from 'react';
import { Bookmark } from '../types';
import { Search, ExternalLink, Edit, Trash2, Tag, X } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

interface Props {
  bookmarks: Bookmark[];
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export default function BookmarkList({ bookmarks, onEdit, onDelete, loading }: Props) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { tag: selectedTag } = useParams();

  const allTags = Array.from(
    new Set(bookmarks.flatMap(b => b.tags))
  ).sort();

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = search.toLowerCase() === '' ||
      bookmark.title.toLowerCase().includes(search.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(search.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(search.toLowerCase());

    const matchesTag = !selectedTag || bookmark.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Yer imlerinde ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Etiketlere Göre Filtrele</h3>
            {selectedTag && (
              <button
                onClick={() => navigate('/')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Filtreyi Temizle
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Link
                key={tag}
                to={`/tag/${encodeURIComponent(tag)}`}
                className={`group inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <Tag className={`mr-1.5 h-4 w-4 ${
                  selectedTag === tag
                    ? 'text-blue-600'
                    : 'text-gray-500 group-hover:text-gray-600'
                }`} />
                {tag}
                {selectedTag === tag && (
                  <X className="ml-1.5 h-3.5 w-3.5 text-blue-600" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {selectedTag && (
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Tag className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Etiket: {selectedTag}
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  {filteredBookmarks.length} sonuç bulundu
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredBookmarks.map(bookmark => (
          <div
            key={bookmark.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {bookmark.title || bookmark.url}
                </h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  {bookmark.url}
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(bookmark)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(bookmark.id)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            {bookmark.description && (
              <p className="mt-2 text-sm text-gray-600">
                {bookmark.description}
              </p>
            )}
            {bookmark.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {bookmark.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/tag/${encodeURIComponent(tag)}`}
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <Tag className={`mr-1 h-3 w-3 ${
                      selectedTag === tag
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }`} />
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {filteredBookmarks.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-200 p-8">
            <div className="text-center">
              <Tag className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Yer imi bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">
                {search ? 'Arama kriterlerinizi değiştirmeyi deneyin' : 'Yeni yer imleri ekleyerek başlayın'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}