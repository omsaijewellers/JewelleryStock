import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import QRScanner from './QRScanner';
import Footer from "./Footer";

export default function Dashboard({ apiBase, token, onLogout }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // New state for full edit
  const [form, setForm] = useState({ productId: '', name: '', category: 'Gold', weight: "", wastage: "", pieces: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchItems = async (opts = {}) => {
    setLoading(true);
    try {
      const q = opts.q ?? search;
      const category = opts.category;
      let url = `${apiBase}/jewelry?`;
      if (q) url += `q=${encodeURIComponent(q)}&`;
      if (category) url += `category=${encodeURIComponent(category)}`;
      const res = await axios.get(url, { headers });
      setItems(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch items. Check console.');
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchItems(); }, []);

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const qrCodeData = JSON.stringify({ productId: form.productId, name: form.name });
      const payload = { ...form, qrCodeData };
      const res = await axios.post(`${apiBase}/jewelry`, payload, { headers });
      setItems(prev => [res.data, ...prev]);
      setForm({ productId:'', name:'', category:'Gold', weight:0, wastage:0, pieces:0, price:0 });
      setPage('dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed add');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await axios.delete(`${apiBase}/jewelry/${id}`, { headers });
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) { console.error(err); alert('Delete failed'); }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const res = await axios.put(`${apiBase}/jewelry/${id}`, updates, { headers });
      setItems(prev => prev.map(i => i._id === id ? res.data : i));
      setSelected(null);
      setEditingItem(null);
    } catch (err) { console.error(err); alert('Update failed'); }
  };

  const handleSell = async (id, qty = 1) => {
    try {
      const res = await axios.post(`${apiBase}/jewelry/sell/${id}`, { qty }, { headers });
      setItems(prev => prev.map(i => i._id === id ? res.data.item : i));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Sell failed');
    }
  };

  const onQrScanned = (decodedText) => {
    try {
      const data = JSON.parse(decodedText);
      const item = items.find(i => i.productId === data.productId) || items.find(i => i.qrCodeData === decodedText);
      if (item) setSelected(item);
      else alert('Item not found in current table. Try refresh.');
    } catch (err) {
      const item = items.find(i => i.productId === decodedText || i.name === decodedText);
      if (item) setSelected(item);
      else alert('Scanned data not recognized.');
    }
  };

  const downloadQr = (item) => {
    const canvas = document.getElementById(`qr-${item._id}`);
    if (!canvas) return alert('QR not rendered yet');
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${item.productId || item._id}-qr.png`;
    a.click();
  };

  const categoryFilter = page === 'gold' ? 'Gold' : page === 'silver' ? 'Silver' : undefined;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar desktop */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-extrabold text-yellow-700">OmSai Jewellers</h1>
        </div>
        <nav className="p-4 space-y-2">
          <button onClick={()=>{setPage('dashboard'); fetchItems({category:undefined})}} className="w-full text-left">Dashboard</button>
          <button onClick={()=>setPage('add')} className="w-full text-left">Add Item</button>
          <button onClick={()=>{setPage('gold'); fetchItems({category:'Gold'})}} className="w-full text-left">Gold Stock</button>
          <button onClick={()=>{setPage('silver'); fetchItems({category:'Silver'})}} className="w-full text-left">Silver Stock</button>
          <button onClick={()=>{setPage('reports')}} className="w-full text-left">Reports</button>
          <button onClick={() => { onLogout(); }} className="w-full text-left text-red-600 mt-6">Logout</button>
        </nav>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden flex justify-between items-center bg-white border-b px-4 py-3">
        <h1 className="text-lg font-bold text-yellow-700">OmSai Jewellers</h1>
        <button onClick={()=>setMobileMenu(!mobileMenu)} className="p-2 border rounded">☰</button>
      </div>

      {mobileMenu && (
        <div className="md:hidden bg-white border-b p-4 space-y-2">
          <button onClick={()=>{setPage('dashboard'); fetchItems(); setMobileMenu(false)}} className="block w-full text-left">Dashboard</button>
          <button onClick={()=>{setPage('add'); setMobileMenu(false)}} className="block w-full text-left">Add Item</button>
          <button onClick={()=>{setPage('gold'); fetchItems({category:'Gold'}); setMobileMenu(false)}} className="block w-full text-left">Gold Stock</button>
          <button onClick={()=>{setPage('silver'); fetchItems({category:'Silver'}); setMobileMenu(false)}} className="block w-full text-left">Silver Stock</button>
          <button onClick={()=>{setPage('reports'); setMobileMenu(false)}} className="block w-full text-left">Reports</button>
          <button onClick={onLogout} className="block w-full text-left text-red-600">Logout</button>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <div>
            <h2 className="text-3xl font-bold text-yellow-700">JewelStock</h2>
            <p className="text-sm text-gray-500">Inventory manager for OmSai Jewellers</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input placeholder="Search by Product ID / Name / Category"
              className="p-2 border rounded flex-1"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
            <button onClick={()=>fetchItems({ q: search, category: categoryFilter })} className="bg-yellow-600 text-white px-3 py-2 rounded">Search</button>
            <button onClick={()=>{ setSearch(''); fetchItems({ category: categoryFilter }); }} className="px-3 py-2 border rounded">Clear</button>
          </div>
        </div>

        {/* Add form */}
        {page === 'add' && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-3">Add Jewelry Item</h3>
            <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input required placeholder="Product ID" className="p-2 border rounded" value={form.productId} onChange={(e)=>setForm({...form, productId:e.target.value})}/>
              <input required placeholder="Name" className="p-2 border rounded" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/>
              <select className="p-2 border rounded" value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})}>
                <option>Gold</option><option>Silver</option>
              </select>
              <input required type="number" step="0.01" placeholder="Weight (g)" className="p-2 border rounded" value={form.weight} onChange={(e)=>setForm({...form, weight:parseFloat(e.target.value)})}/>
              <input type="number" step="0.01" placeholder="Wastage (g)" className="p-2 border rounded" value={form.wastage} onChange={(e)=>setForm({...form, wastage:parseFloat(e.target.value)})}/>
              <input required type="number" placeholder="Pieces" className="p-2 border rounded" value={form.pieces} onChange={(e)=>setForm({...form, pieces:parseInt(e.target.value)})}/>
              <input required type="number" placeholder="Price" className="p-2 border rounded" value={form.price} onChange={(e)=>setForm({...form, price:parseFloat(e.target.value)})}/>
              <div className="md:col-span-3 flex gap-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded">Add Item</button>
                <button type="button" onClick={()=>setForm({ productId:'', name:'', category:'Gold', weight:0, wastage:0, pieces:0, price:0 })} className="px-4 py-2 border rounded">Reset</button>
              </div>
            </form>
          </div>
        )}

        {/* Dashboard / Table */}
        {(page === 'dashboard' || page === 'gold' || page === 'silver' || page === 'reports') && (
          <div className="bg-white p-4 rounded shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <h3 className="font-semibold">Stock Inventory {categoryFilter ? `— ${categoryFilter}` : ''}</h3>
              <div className="flex gap-2 items-center">
                <QRScanner onResult={onQrScanned} />
                <div className="text-xs text-gray-500">Scan item QR</div>
              </div>
            </div>

            {/* Table on desktop */}
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-yellow-100">
                  <tr>
                    <th className="p-2 text-left">Product ID</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-right">Weight (g)</th>
                    <th className="p-2 text-right">Wastage (g)</th>
                    <th className="p-2 text-right">Pieces</th>
                    <th className="p-2 text-center">QR</th>
                    <th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{item.productId}</td>
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.category}</td>
                      <td className="p-2 text-right">{item.weight}</td>
                      <td className="p-2 text-right">{item.wastage}</td>
                      <td className="p-2 text-right font-bold">{item.pieces}</td>
                      <td className="p-2 text-center">
                        <QRCodeCanvas id={`qr-${item._id}`} value={item.qrCodeData || JSON.stringify({productId:item.productId,name:item.name})} size={80} level="H" />
                        <button onClick={()=>downloadQr(item)} className="block mt-1 text-xs px-2 py-1 border rounded">Download</button>
                      </td>
                      <td className="p-2 text-right flex flex-wrap gap-1 justify-end">
                        <button onClick={()=>setSelected(item)} className="px-2 py-1 border rounded">View</button>
                        <button onClick={()=>setEditingItem(item)} className="px-2 py-1 bg-blue-600 text-white rounded">Edit</button>
                        <button onClick={()=>handleSell(item._id)} disabled={item.pieces<=0} className="px-2 py-1 bg-red-600 text-white rounded disabled:opacity-50">Sell</button>
                        <button onClick={()=>handleDelete(item._id)} className="px-2 py-1 border rounded text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {items.length===0 && <tr><td className="p-4" colSpan={8}>No items found.</td></tr>}
                </tbody>
              </table>
            </div>

            {/* Cards on mobile */}
            <div className="md:hidden grid gap-4">
              {items.map(item => (
                <div key={item._id} className="p-4 border rounded shadow">
                  <h4 className="font-bold text-yellow-700">{item.name}</h4>
                  <p>ID: {item.productId}</p>
                  <p>Category: {item.category}</p>
                  <p>Weight: {item.weight} g | Wastage: {item.wastage} g</p>
                  <p>Pieces: {item.pieces}</p>
                  <div className="flex justify-between items-center mt-2">
                    <QRCodeCanvas value={item.qrCodeData} size={60} />
                    <div className="flex gap-2">
                      <button onClick={()=>setSelected(item)} className="px-2 py-1 border rounded">View</button>
                      <button onClick={()=>setEditingItem(item)} className="px-2 py-1 bg-blue-600 text-white rounded">Edit</button>
                      <button onClick={()=>handleSell(item._id)} disabled={item.pieces<=0} className="px-2 py-1 bg-red-600 text-white rounded disabled:opacity-50">Sell</button>
                    </div>
                  </div>
                </div>
              ))}
              {items.length===0 && <p className="text-center text-gray-500">No items found.</p>}
            </div>
          </div>
        )}

        {/* View Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded shadow w-full max-w-sm md:max-w-lg">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-semibold">{selected.name}</h4>
                <button onClick={()=>setSelected(null)} className="text-gray-500">Close</button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div><strong>Product ID</strong><div>{selected.productId}</div></div>
                <div><strong>Category</strong><div>{selected.category}</div></div>
                <div><strong>Weight</strong><div>{selected.weight} g</div></div>
                <div><strong>Wastage</strong><div>{selected.wastage} g</div></div>
                <div><strong>Pieces</strong><div>{selected.pieces}</div></div>
                <div><strong>Price</strong><div>{selected.price}</div></div>
                <div className="col-span-2 text-center mt-2">
                  <QRCodeCanvas value={selected.qrCodeData || JSON.stringify({productId:selected.productId,name:selected.name})} size={140} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-end">
                <button onClick={()=>handleSell(selected._id)} className="px-4 py-2 bg-red-600 text-white rounded">Sell One</button>
                <button onClick={()=>setSelected(null)} className="px-4 py-2 border rounded">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded shadow w-full max-w-sm md:max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Edit Item: {editingItem.productId}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="block mb-1">Name</label>
                  <input type="text" value={editingItem.name} onChange={(e)=>setEditingItem({...editingItem,name:e.target.value})} className="border p-2 w-full rounded"/>
                </div>
                <div>
                  <label className="block mb-1">Category</label>
                  <select value={editingItem.category} onChange={(e)=>setEditingItem({...editingItem,category:e.target.value})} className="border p-2 w-full rounded">
                    <option>Gold</option><option>Silver</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Weight (g)</label>
                  <input type="number" value={editingItem.weight} onChange={(e)=>setEditingItem({...editingItem,weight:parseFloat(e.target.value)})} className="border p-2 w-full rounded"/>
                </div>
                <div>
                  <label className="block mb-1">Wastage (g)</label>
                  <input type="number" value={editingItem.wastage} onChange={(e)=>setEditingItem({...editingItem,wastage:parseFloat(e.target.value)})} className="border p-2 w-full rounded"/>
                </div>
                <div>
                  <label className="block mb-1">Pieces</label>
                  <input type="number" value={editingItem.pieces} onChange={(e)=>setEditingItem({...editingItem,pieces:parseInt(e.target.value)})} className="border p-2 w-full rounded"/>
                </div>
                <div>
                  <label className="block mb-1">Price</label>
                  <input type="number" value={editingItem.price} onChange={(e)=>setEditingItem({...editingItem,price:parseFloat(e.target.value)})} className="border p-2 w-full rounded"/>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={()=>setEditingItem(null)} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={()=>handleUpdate(editingItem._id, editingItem)} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}
