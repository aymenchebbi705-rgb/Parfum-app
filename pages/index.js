import { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (url && key) {
      fetchData();
    }
  }, [url, key]);

  const fetchData = async () => {
    try {
      const resP = await fetch(`${url}/rest/v1/products?select=*`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` }
      });
      const dataP = await resP.json();
      if (Array.isArray(dataP)) setProducts(dataP);

      const resS = await fetch(`${url}/rest/v1/sales?select=*`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` }
      });
      const dataS = await resS.json();
      if (Array.isArray(dataS)) setSales(dataS);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !stock || !price) return;
    await fetch(`${url}/rest/v1/products`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ name, stock: Number(stock), price: Number(price) })
    });
    setName('');
    setStock('');
    setPrice('');
    fetchData();
  };

  if (!url || !key) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif', direction: 'rtl' }}>
        <h2>🧴 نظام إدارة العطورات MOKAÏ</h2>
        <p style={{ color: 'red' }}>تنبيه: يلزم إضافة Environment Variables في Vercel وتفعيل Redeploy.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', direction: 'rtl', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1e293b' }}>🧴 نظام إدارة العطورات MOKAÏ</h1>
        <p style={{ color: '#64748b' }}>متابعة المخزون والمبيعات</p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('inventory')} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'inventory' ? '#2563eb' : '#cbd5e1', color: '#fff', fontWeight: 'bold' }}>📦 المخزون</button>
        <button onClick={() => setActiveTab('sales')} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'sales' ? '#16a34a' : '#cbd5e1', color: '#fff', fontWeight: 'bold' }}>💰 المبيعات</button>
      </div>

      {activeTab === 'inventory' ? (
        <div>
          <form onSubmit={handleAddProduct} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="اسم المنتج/العطر" value={name} onChange={e => setName(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: '1' }} required />
            <input type="number" placeholder="الكمية" value={stock} onChange={e => setStock(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100px' }} required />
            <input type="number" step="0.1" placeholder="السعر" value={price} onChange={e => setPrice(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100px' }} required />
            <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>إضافة</button>
          </form>

          <table style={{ width: '100%', backgroundColor: '#fff', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e293b', color: '#fff' }}>
                <th style={{ padding: '10px' }}>المنتج</th>
                <th style={{ padding: '10px' }}>المخزون</th>
                <th style={{ padding: '10px' }}>السعر</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>
                  <td style={{ padding: '10px' }}>{p.name}</td>
                  <td style={{ padding: '10px', color: p.stock < 10 ? 'red' : 'green', fontWeight: 'bold' }}>{p.stock}</td>
                  <td style={{ padding: '10px' }}>{p.price} د.ت</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <table style={{ width: '100%', backgroundColor: '#fff', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#16a34a', color: '#fff' }}>
              <th style={{ padding: '10px' }}>المنتج</th>
              <th style={{ padding: '10px' }}>الكمية</th>
              <th style={{ padding: '10px' }}>المجموع</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>
                <td style={{ padding: '10px' }}>{s.product_name}</td>
                <td style={{ padding: '10px' }}>{s.quantity}</td>
                <td style={{ padding: '10px' }}>{s.total_price} د.ت</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
