import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Product } from '../../types';
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  Tag,
  Sparkles,
  Layers,
  Check,
  X,
  AlertTriangle,
  Flame,
  Star,
  Image as ImageIcon,
  FileText,
  Percent,
} from 'lucide-react';

export const ProductManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'details' | 'specs'>('basic');

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<
    'laptops' | 'smartphones' | 'smartwatches' | 'audio' | 'gaming' | 'components'
  >('laptops');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [featured, setFeatured] = useState<boolean>(true);
  const [isNewArrival, setIsNewArrival] = useState<boolean>(true);

  // Images
  const [thumbnail, setThumbnail] = useState('');
  const [imagesInput, setImagesInput] = useState('');

  // Descriptions
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [warranty, setWarranty] = useState('1 Year Official Brand Warranty');

  // Specs & In-box
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const [inBoxItems, setInBoxItems] = useState<string[]>([]);
  const [inBoxInput, setInBoxInput] = useState('');

  // Search & Filters
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchTerm.trim() ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate Auto Discount when price or originalPrice changes
  const handleOriginalPriceChange = (val: number) => {
    setOriginalPrice(val);
    if (val > price && price > 0) {
      setDiscountPercentage(Math.round(((val - price) / val) * 100));
    }
  };

  const handlePriceChange = (val: number) => {
    setPrice(val);
    if (originalPrice > val && val > 0) {
      setDiscountPercentage(Math.round(((originalPrice - val) / originalPrice) * 100));
    }
  };

  const handleAddSpec = () => {
    if (!specKey.trim() || !specValue.trim()) return;
    setSpecifications((prev) => [...prev, { key: specKey.trim(), value: specValue.trim() }]);
    setSpecKey('');
    setSpecValue('');
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddInBox = () => {
    if (!inBoxInput.trim()) return;
    setInBoxItems((prev) => [...prev, inBoxInput.trim()]);
    setInBoxInput('');
  };

  const handleRemoveInBox = (idx: number) => {
    setInBoxItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setBrand('');
    setCategory('laptops');
    setPrice(0);
    setOriginalPrice(0);
    setDiscountPercentage(0);
    setStock(10);
    setFeatured(true);
    setIsNewArrival(true);
    setThumbnail('');
    setImagesInput('');
    setShortDesc('');
    setDescription('');
    setWarranty('1 Year Official Brand Warranty');
    setSpecifications([]);
    setInBoxItems(['Device Unit', 'Power Adapter & Cable', 'User Manual']);
    setActiveTab('basic');
  };

  const startCreate = () => {
    resetForm();
    setShowFormModal(true);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setBrand(p.brand);
    setCategory(p.category);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || p.price);
    setDiscountPercentage(p.discountPercentage || 0);
    setStock(p.stock);
    setFeatured(Boolean(p.featured));
    setIsNewArrival(Boolean(p.isNewArrival));
    setThumbnail(p.thumbnail);
    setImagesInput(p.images ? p.images.join(', ') : p.thumbnail);
    setShortDesc(p.shortDescription || '');
    setDescription(p.description || p.shortDescription || '');
    setWarranty(p.warranty || '1 Year Official Warranty');
    setSpecifications(p.specifications || []);
    setInBoxItems(p.inBox || ['Device Unit', 'User Manual']);
    setActiveTab('basic');
    setShowFormModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedImages = imagesInput
      ? imagesInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [thumbnail || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'];

    const mainThumbnail = thumbnail || parsedImages[0];

    const productPayload = {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand,
      category,
      price: Number(price),
      originalPrice: originalPrice > price ? Number(originalPrice) : undefined,
      discountPercentage: discountPercentage > 0 ? Number(discountPercentage) : undefined,
      stock: Number(stock),
      featured,
      isNewArrival,
      thumbnail: mainThumbnail,
      images: parsedImages,
      shortDescription: shortDesc || `${name} by ${brand}`,
      description: description || shortDesc || `${name} by ${brand}`,
      specifications,
      warranty,
      inBox: inBoxItems.length > 0 ? inBoxItems : ['Device Unit'],
    };

    if (editingId) {
      updateProduct(editingId, productPayload);
    } else {
      addProduct({
        ...productPayload,
        rating: 5.0,
        reviewCount: 1,
      });
    }

    setShowFormModal(false);
    resetForm();
  };

  const totalCatalogValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock < 5).length;
  const discountedCount = products.filter((p) => (p.discountPercentage || 0) > 0).length;

  return (
    <div className="space-y-6">
      {/* Product Management Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Total Electronics Catalog</div>
            <div className="text-xl font-black text-white">{products.length} Products</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Inventory Valuation</div>
            <div className="text-xl font-black text-emerald-400">৳{totalCatalogValue.toLocaleString('en-BD')}</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">On Sale / Discounted</div>
            <div className="text-xl font-black text-amber-400">{discountedCount} Products</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Low Stock Restock Alerts</div>
            <div className="text-xl font-black text-rose-400">{lowStockCount} Items</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Category Filter, and Add Button */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search product title, brand, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none w-full"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="laptops">Laptops & Mac</option>
            <option value="smartphones">Smartphones</option>
            <option value="smartwatches">Smartwatches</option>
            <option value="audio">Audio & Sound</option>
            <option value="gaming">Gaming Consoles</option>
            <option value="components">PC Components</option>
          </select>
        </div>

        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-blue-500/25 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product (নতুন প্রোডাক্ট যোগ করুন)</span>
        </button>
      </div>

      {/* Main Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-bold">
                <th className="p-4">Product Details</th>
                <th className="p-4">Category & Brand</th>
                <th className="p-4">Price & Discount</th>
                <th className="p-4 text-center">Stock Inventory</th>
                <th className="p-4 text-center">Badges & Offer Tag</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Thumbnail & Title */}
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-xl bg-slate-950 border border-slate-800 flex-shrink-0"
                    />
                    <div className="min-w-0 max-w-sm">
                      <div className="font-bold text-white text-sm line-clamp-1">{product.name}</div>
                      <div className="text-slate-400 text-[11px] truncate mt-0.5">{product.shortDescription}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {product.id}</div>
                    </div>
                  </td>

                  {/* Brand & Category */}
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase">
                      {product.brand}
                    </span>
                    <div className="text-slate-300 font-medium capitalize mt-1 text-xs">{product.category}</div>
                  </td>

                  {/* Price & Offer */}
                  <td className="p-4">
                    <div className="font-black text-white text-sm">৳{product.price.toLocaleString('en-BD')}</div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                        <span className="text-slate-500 line-through">৳{product.originalPrice.toLocaleString('en-BD')}</span>
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded text-[10px]">
                          {product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-bold text-[10px] ${
                        product.stock === 0
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : product.stock < 5
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                    </span>
                  </td>

                  {/* Badges */}
                  <td className="p-4 text-center space-y-1">
                    {product.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase border border-purple-500/30 mr-1">
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    )}
                    {product.isNewArrival && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/30">
                        <Sparkles className="w-3 h-3" /> New
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => startEdit(product)}
                      className="p-2 bg-slate-800 text-blue-400 hover:text-white hover:bg-blue-600 rounded-xl transition-all"
                      title="Edit Product Details & Specs"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                          deleteProduct(product.id);
                        }
                      }}
                      className="p-2 bg-slate-800 text-rose-400 hover:text-white hover:bg-rose-600 rounded-xl transition-all"
                      title="Remove Product"
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

      {/* Rich Comprehensive Product Edit & Add Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl my-8">
            {/* Modal Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">
                    {editingId ? 'Edit Product Details & Pricing' : 'Add New Electronics Product'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Set title, category, discount percentage, images gallery, and tech specifications
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowFormModal(false)}
                className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-2 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'basic' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" /> 1. Title, Price & Stock
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('images')}
                className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'images' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> 2. Product Images
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'details' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Percent className="w-4 h-4" /> 3. Descriptions & Offers
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'specs' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" /> 4. Specs & In-Box
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* TAB 1: BASIC & PRICING */}
              {activeTab === 'basic' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-semibold mb-1">Product Title / Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. MacBook Pro 16 M3 Max (36GB RAM, 1TB SSD)"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Brand Name *</label>
                      <input
                        type="text"
                        required
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="Apple, Samsung, Sony..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
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
                        onChange={(e) => handlePriceChange(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Original MRP Price (৳)</label>
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Discount (% OFF)</label>
                      <input
                        type="number"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Stock Quantity *</label>
                      <input
                        type="number"
                        required
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Warranty Period</label>
                      <input
                        type="text"
                        value={warranty}
                        onChange={(e) => setWarranty(e.target.value)}
                        placeholder="e.g. 1 Year Official Apple Warranty"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: IMAGES */}
              {activeTab === 'images' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Main Thumbnail URL *</label>
                    <input
                      type="text"
                      required
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Gallery Images (Comma separated URLs)
                    </label>
                    <textarea
                      rows={3}
                      value={imagesInput}
                      onChange={(e) => setImagesInput(e.target.value)}
                      placeholder="https://image1.jpg, https://image2.jpg, https://image3.jpg"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Live Thumbnail Preview */}
                  {thumbnail && (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="text-[11px] font-bold text-slate-400 mb-2">Live Image Preview:</div>
                      <img src={thumbnail} alt="Preview" className="w-24 h-24 object-cover rounded-xl bg-slate-900 border border-slate-800" />
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DESCRIPTIONS & OFFERS */}
              {activeTab === 'details' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Short Description / Key Highlights</label>
                    <textarea
                      rows={2}
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      placeholder="Summarize processor, RAM, screen size, battery in 1-2 lines..."
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Detailed Product Overview</label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Write full product overview, performance benchmarks, build quality details..."
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Offer Badges */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                      Special Promotions & Tags
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="font-semibold text-slate-200">Show in Featured Showcase</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isNewArrival}
                          onChange={(e) => setIsNewArrival(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-semibold text-slate-200">Mark as New Arrival</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SPECS & IN-BOX */}
              {activeTab === 'specs' && (
                <div className="space-y-6 text-xs">
                  {/* Technical Specifications */}
                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                      Technical Specification Pairs
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Key (e.g. Processor)"
                        value={specKey}
                        onChange={(e) => setSpecKey(e.target.value)}
                        className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. Apple M3 Max 16-Core)"
                        value={specValue}
                        onChange={(e) => setSpecValue(e.target.value)}
                        className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddSpec}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                      >
                        Add Spec
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {specifications.map((s, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                        >
                          <strong className="text-blue-400">{s.key}:</strong> {s.value}
                          <button type="button" onClick={() => handleRemoveSpec(idx)} className="text-slate-500 hover:text-rose-400 ml-1">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* In-Box Accessories */}
                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                      In-The-Box Accessories List
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Item (e.g. 140W MagSafe Charger)"
                        value={inBoxInput}
                        onChange={(e) => setInBoxInput(e.target.value)}
                        className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddInBox}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
                      >
                        Add Item
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {inBoxItems.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> {item}
                          <button type="button" onClick={() => handleRemoveInBox(idx)} className="text-slate-500 hover:text-rose-400 ml-1">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-5 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-xl shadow-blue-500/25 hover:scale-[1.01] transition-all"
                >
                  {editingId ? 'Save & Update Product' : 'Publish Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
