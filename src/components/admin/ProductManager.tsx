import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Product } from '../../types';
import { Plus, Trash2, Edit3 } from 'lucide-react';

export const ProductManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<'laptops' | 'smartphones' | 'smartwatches' | 'audio' | 'gaming' | 'components'>('laptops');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [thumbnail, setThumbnail] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [warranty, setWarranty] = useState('1 Year Official Brand Warranty');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);

  const handleAddSpec = () => {
    if (!specKey || !specValue) return;
    setSpecifications((prev) => [...prev, { key: specKey, value: specValue }]);
    setSpecKey('');
    setSpecValue('');
  };

  const handleRemoveSpec = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedImages = imagesInput
      ? imagesInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [thumbnail || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'];

    if (editingId) {
      updateProduct(editingId, {
        name,
        brand,
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        stock: Number(stock),
        thumbnail: thumbnail || parsedImages[0],
        images: parsedImages,
        shortDescription: shortDesc,
        warranty,
        specifications,
      });
      setEditingId(null);
    } else {
      addProduct({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand,
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        discountPercentage: originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined,
        stock: Number(stock),
        rating: 5.0,
        reviewCount: 1,
        featured: true,
        isNewArrival: true,
        thumbnail: thumbnail || parsedImages[0],
        images: parsedImages,
        shortDescription: shortDesc,
        description: shortDesc,
        specifications,
        warranty,
        inBox: ['Product Unit', 'User Manual', 'Power Adapter / Accessories'],
      });
    }

    resetForm();
    setShowAddForm(false);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setBrand(p.brand);
    setCategory(p.category);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || 0);
    setStock(p.stock);
    setThumbnail(p.thumbnail);
    setImagesInput(p.images.join(', '));
    setShortDesc(p.shortDescription);
    setWarranty(p.warranty);
    setSpecifications(p.specifications || []);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setName('');
    setBrand('');
    setPrice(0);
    setOriginalPrice(0);
    setStock(10);
    setThumbnail('');
    setImagesInput('');
    setShortDesc('');
    setSpecifications([]);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h2 className="text-xl font-black text-white">Electronics Product Catalog Manager</h2>
          <p className="text-xs text-slate-400">Add, edit, adjust stock levels, and upload multi-angle images</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> {showAddForm ? 'Close Form' : 'Add New Electronics Product'}
        </button>
      </div>

      {/* Add / Edit Form Modal or Panel */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-blue-500/30 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
          <div className="text-sm font-black text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>{editingId ? 'Edit Electronics Product' : 'Add New Product to Store'}</span>
            <span className="text-xs font-normal text-blue-400">Multi-image & Tech Specs Enabled</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. MacBook Pro 16 M3 Max 36GB RAM..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Brand *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Apple, Samsung, Sony, Asus..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              >
                <option value="laptops">Laptops & Mac</option>
                <option value="smartphones">Smartphones</option>
                <option value="smartwatches">Smartwatches</option>
                <option value="audio">Audio & Sound</option>
                <option value="gaming">Gaming Consoles</option>
                <option value="components">PC Components</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Selling Price (৳) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Original Price (৳)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Main Thumbnail URL *</label>
              <input
                type="text"
                required
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-300 font-semibold mb-1">Multi-Angle Image URLs (Comma Separated)</label>
              <input
                type="text"
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                placeholder="https://image1.jpg, https://image2.jpg..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-300 font-semibold mb-1">Short Description / Key Features</label>
              <textarea
                rows={2}
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Technical Specs Builder */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Specification Key-Value Pairs
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Spec Key (e.g. Processor)"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                placeholder="Spec Value (e.g. Intel i9 14900HX)"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
              >
                Add Spec
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {specifications.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300"
                >
                  <strong className="text-blue-400">{s.key}:</strong> {s.value}
                  <button type="button" onClick={() => handleRemoveSpec(idx)} className="text-slate-500 hover:text-rose-400 ml-1">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20"
            >
              {editingId ? 'Save Product Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-bold">
                <th className="p-4">Product</th>
                <th className="p-4">Brand & Category</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.thumbnail} alt="" className="w-12 h-12 object-cover rounded-xl bg-slate-950 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-white text-sm line-clamp-1">{product.name}</div>
                      <div className="text-slate-500 text-[11px]">ID: {product.id}</div>
                    </div>
                  </td>

                  <td className="p-4 font-semibold">
                    <span className="text-blue-400 uppercase font-bold">{product.brand}</span>
                    <div className="text-slate-400 capitalize">{product.category}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-black text-white text-sm">৳{product.price.toLocaleString('en-BD')}</div>
                    {product.originalPrice && (
                      <div className="text-slate-500 line-through text-[11px]">৳{product.originalPrice.toLocaleString('en-BD')}</div>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        product.stock < 5 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => startEdit(product)}
                      className="p-1.5 bg-slate-800 text-blue-400 hover:text-white rounded-lg transition-all"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${product.name}"?`)) deleteProduct(product.id);
                      }}
                      className="p-1.5 bg-slate-800 text-rose-400 hover:text-white rounded-lg transition-all"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
