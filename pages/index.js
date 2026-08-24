import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('زيت أساسي');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');

  // Sales form
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: prodData } = await supabase.from('products').select('*');
    const { data: saleData } = await supabase.from('sales').select('*');
    if (prodData) setProducts(prodData);
    if (saleData) setSales(saleData);
    setLoading(false);
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    if (!name || !stock || !price) return;
    const { error } = await supabase.from('products').insert([
      { name, category, stock: Number(stock), price: Number(price) }
    ]);
    if (!error) {
      setName('');
      setStock('');
      setPrice('');
      fetchData();
    }
  }

  async function handleAddSale(e) {
    e.preventDefault();
    if (!selectedProduct || !quantity) return;
    const prod = products.find(p => p.id === Number(selectedProduct));
    if (!prod || prod.stock < Number(quantity)) {
      alert('الكمية غير متوفرة في المخزون!');
      return;
    }

    const total = prod.price * Number(quantity);
    const { error: saleErr } = await supabase.from('sales').insert([
      { product_id: prod.id, product_name: prod.name, quantity: Number(quantity), total_price: total }
    ]);

    if (!saleErr) {
      await supabase.from('products').update({ stock: prod.stock - Number(quantity) }).eq('id', prod.id);
      setSelectedProduct('');
      setQuantity('');
      fetchData();
    }
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', direction: 'rtl', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>🧴 نظام إدارة العطورات MOKAÏ</h1>
        <p style={{ color: '#7f8c8d' }}>منصة متابعة المخزون والمبيعات اليومية</p>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('inventory')}
          style={{ padding: '10px 25px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'inventory' ? '#3498db' : '#e0e0e0', color: activeTab === 'inventory' ? '#fff' : '#333' }}>
          📦 إدارة المخزون
        </button>
        <button 
          onClick={() => setActiveTab('sales')}
          style={{ padding: '10px 25px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'sales' ? '#2ecc71' : '#e0e0e0', color: activeTab === 'sales' ? '#fff' : '#333' }}>
          💰 المبيعات
        </button>
      </nav>

      {loading ? (
        <p style={{ textAlign: 'center' }}>جاري تحميل البيانات...</p>
      ) : activeTab === 'inventory' ? (
        <div>
          <form onSubmit={handleAddProduct} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
            <input type="text" placeholder="اسم العطر / المادة" value={name} onChange={e => setName(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required />
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
              <option value="زيت أساسي">زيت أساسي</option>
              <option value="كحول تركيب">كحول تركيب</option>
              <option value="قنينة زجاجية">قنينة زجاجية</option>
              <option value="عطر جاهز">عطر جاهز</option>
            </select>
            <input type="number" placeholder="الكمية (مل / قطعة)" value={stock} onChange={e => setStock(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required />
            <input type="number" step="0.1" placeholder="السعر (د.ت)" value={price} onChange={e => setPrice(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required />
            <button type="submit" style={{ backgroundColor: '#3498db', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>إضافة للمخزون</button>
          </form>

          <table style={{ width: '100%', backgroundColor: '#fff', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#34495e', color: '#fff' }}>
                <th style={{ padding: '12px' }}>الاسم</th>
                <th style={{ padding: '12px' }}>الصنف</th>
                <th style={{ padding: '12px' }}>المخزون المتوفر</th>
                <th style={{ padding: '12px' }}>السعر الفردي</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>
                  <td style={{ padding: '12px' }}>{p.name}</td>
                  <td style={{ padding: '12px' }}>{p.category}</td>
                  <td style={{ padding: '12px', color: p.stock < 10 ? 'red' : 'green', fontWeight: 'bold' }}>{p.stock}</td>
                  <td style={{ padding: '12px' }}>{p.price} د.ت</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <form onSubmit={handleAddSale} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required>
              <option value="">اختر العطر / المنتج...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (المتوفر: {p.stock})</option>
              ))}
            </select>
            <input type="number" placeholder="الكمية المباعة" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required />
            <button type="submit" style={{ backgroundColor: '#2ecc71', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>تسجيل عملية بيع</button>
          </form>

          <table style={{ width: '100%', backgroundColor: '#fff', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#27ae60', color: '#fff' }}>
                <th style={{ padding: '12px' }}>المنتج</th>
                <th style={{ padding: '12px' }}>الكمية</th>
                <th style={{ padding: '12px' }}>المبلغ الإجمالي</th>
                <th style={{ padding: '12px' }}>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>
                  <td style={{ padding: '12px' }}>{s.product_name}</td>
                  <td style={{ padding: '12px' }}>{s.quantity}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{s.total_price} د.ت</td>
                  <td style={{ padding: '12px' }}>{new Date(s.created_at).toLocaleDateString('ar-TN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
