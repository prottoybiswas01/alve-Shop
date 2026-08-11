import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Product } from '../../types';
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  Tag,
  Layers,
  X,
  AlertTriangle,
  Flame,
  Package,
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
  const [category, setCategory] = useState<string>('Laptops & Computers');
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

  const categoriesList = [
    'Laptops & Computers',
    'Smartphones',
    'Audio & Electronics',
    'Pickles & Preserves',
    'Honey & Spices',
    'Daily Essentials',
    'Stationeries',
    'Groceries',
  ];

  // Search & Filters
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchTerm.trim() ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setBrand('');
    setCategory('Laptops & Computers');
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
    setInBoxItems([]);
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
    setDescription(p.description || '');
    setWarranty(p.warranty || '1 Year Official Brand Warranty');
    setSpecifications(p.specifications || []);
    setInBoxItems(p.inBox || []);
    setShowFormModal(true);
    setActiveTab('basic');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !brand.trim() || price <= 0) {
      alert('Please fill in product title, brand, and valid price!');
      return;
    }

    const imageArray = imagesInput.trim()
      ? imagesInput.split(',').map((s) => s.trim())
      : [thumbnail || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'];

    const productPayload = {
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: brand.trim(),
      category: category.trim(),
      price: Number(price),
      originalPrice: originalPrice > price ? Number(originalPrice) : Number(price),
      discountPercentage: Number(discountPercentage),
      stock: Number(stock),
      featured,
      isNewArrival,
      thumbnail: thumbnail.trim() || imageArray[0],
      images: imageArray,
      shortDescription: shortDesc.trim() || name.trim(),
      description: description.trim() || name.trim(),
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
      {/* Product Management Header KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Total Catalog Products</div>
            <div className="text-xl font-black text-slate-900">{products.length} Products</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Inventory Valuation</div>
            <div className="text-xl font-black text-emerald-600">৳{totalCatalogValue.toLocaleString('en-BD')}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Discount Offers</div>
            <div className="text-xl font-black text-amber-600">{discountedCount} Products</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Low Stock Restock Alerts</div>
            <div className="text-xl font-black text-rose-600">{lowStockCount} Items</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Category Filter, Add Button */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search product title, brand, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none w-full"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categoriesList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {products.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all products from the store?')) {
                  products.forEach((p) => deleteProduct(p.id));
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-bold text-xs transition-all border border-rose-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}

          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Main Products List Table or Clean Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF5EE] text-slate-700 border-b border-slate-200 uppercase tracking-wider font-bold">
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category & Brand</th>
                  <th className="p-4">Price & Offer</th>
                  <th className="p-4 text-center">Stock Inventory</th>
                  <th className="p-4 text-center">Badges</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnail}
                          alt=""
                          className="w-12 h-12 object-cover rounded-xl bg-slate-50 border border-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">{product.shortDescription}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-800">{product.brand}</div>
                      <div className="text-[11px] text-[#FF5500] font-semibold">{product.category}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-black text-slate-900 text-sm">৳{product.price.toLocaleString('en-BD')}</div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-[11px] text-slate-400 line-through">
                          ৳{product.originalPrice.toLocaleString('en-BD')} (-{product.discountPercentage}%)
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          product.stock > 10
                            ? 'bg-emerald-100 text-emerald-700'
                            : product.stock > 0
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {product.featured && (
                          <span className="px-2 py-0.5 rounded bg-orange-100 text-[#FF5500] border border-orange-200 text-[9px] font-black uppercase">
                            Featured
                          </span>
                        )}
                        {product.isNewArrival && (
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200 text-[9px] font-black uppercase">
                            New
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => startEdit(product)}
                        className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition-all"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Remove "${product.name}" from store catalog?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 transition-all"
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
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-2xs">
          <div className="w-16 h-16 bg-slate-50 border border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-[#FF5500]" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Catalog Is Clean</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            All fake items have been cleared. Click below to add your first real product entry for production.
          </p>
          <button
            onClick={startCreate}
            className="px-6 py-3 rounded-xl bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Product</span>
          </button>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL DIALOG */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl my-8 text-slate-800">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-20">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingId ? 'Edit Product Details' : 'Add New Product'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure live product information, pricing, images, and specifications.
                </p>
              </div>

              <button
                onClick={() => setShowFormModal(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Tabs */}
            <div className="px-6 pt-4 border-b border-slate-200 flex items-center gap-2 text-xs font-bold">
              <button
                onClick={() => setActiveTab('basic')}
                className={`pb-3 border-b-2 px-3 transition-colors ${
                  activeTab === 'basic' ? 'border-[#FF5500] text-[#FF5500]' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab('images')}
                className={`pb-3 border-b-2 px-3 transition-colors ${
                  activeTab === 'images' ? 'border-[#FF5500] text-[#FF5500]' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Images
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 border-b-2 px-3 transition-colors ${
                  activeTab === 'details' ? 'border-[#FF5500] text-[#FF5500]' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Descriptions & Warranty
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 border-b-2 px-3 transition-colors ${
                  activeTab === 'specs' ? 'border-[#FF5500] text-[#FF5500]' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Specifications & Box
              </button>
            </div>

            {/* Form Fields Body */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-5">
              {activeTab === 'basic' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pure Sundarban Honey 500g / MacBook Pro 16 M3"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Brand *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aura Organic / Apple / Samsung"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF5500]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#FF5500]"
                      >
                        {categoriesList.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Selling Price (৳) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={price || ''}
                        onChange={(e) => handlePriceChange(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#FF5500]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Original MRP (৳)</label>
                      <input
                        type="number"
                        min="0"
                        value={originalPrice || ''}
                        onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#FF5500]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Stock Quantity *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#FF5500]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 accent-[#FF5500]"
                      />
                      <span className="font-bold text-slate-700">Featured Offer Tag</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isNewArrival}
                        onChange={(e) => setIsNewArrival(e.target.checked)}
                        className="w-4 h-4 accent-[#FF5500]"
                      />
                      <span className="font-bold text-slate-700">New Arrival Badge</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'images' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Main Thumbnail Image URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Additional Gallery URLs (Comma Separated)</label>
                    <textarea
                      rows={3}
                      placeholder="https://image1.jpg, https://image2.jpg"
                      value={imagesInput}
                      onChange={(e) => setImagesInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  {thumbnail && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
                      <img src={thumbnail} alt="Preview" className="w-16 h-16 object-cover rounded-lg bg-slate-200" />
                      <div className="text-[11px] text-slate-500 font-medium">Main Thumbnail Preview</div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Short Description</label>
                    <input
                      type="text"
                      placeholder="One-line summary overview of product..."
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Full Description</label>
                    <textarea
                      rows={4}
                      placeholder="Detailed features, usage guidelines, and info..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Warranty Details</label>
                    <input
                      type="text"
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-5 text-xs">
                  {/* Technical Specifications builder */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Add Product Specifications</label>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Key (e.g. Weight / RAM)"
                        value={specKey}
                        onChange={(e) => setSpecKey(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 500g / 16GB)"
                        value={specValue}
                        onChange={(e) => setSpecValue(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddSpec}
                        className="px-4 py-2.5 bg-[#FF5500] text-white font-bold rounded-xl"
                      >
                        Add
                      </button>
                    </div>

                    {specifications.length > 0 && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 divide-y divide-slate-200">
                        {specifications.map((s, idx) => (
                          <div key={idx} className="flex items-center justify-between py-1.5 px-2">
                            <span className="text-slate-600 font-bold">{s.key}: <span className="text-slate-900 font-normal">{s.value}</span></span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSpec(idx)}
                              className="text-rose-600 hover:text-rose-700"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* In-box Accessories builder */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">In-Box Accessories</label>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Item name (e.g. Glass Jar / USB Cable)"
                        value={inBoxInput}
                        onChange={(e) => setInBoxInput(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddInBox}
                        className="px-4 py-2.5 bg-[#FF5500] text-white font-bold rounded-xl"
                      >
                        Add
                      </button>
                    </div>

                    {inBoxItems.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {inBoxItems.map((item, idx) => (
                          <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => setInBoxItems((prev) => prev.filter((_, i) => i !== idx))}
                              className="text-rose-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 font-bold text-xs border border-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs shadow-md transition-all"
                >
                  {editingId ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
