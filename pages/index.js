import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prodQty, setProdQty] = useState(10);
  const [msg, setMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('v_stock_status').select('*');
    if (!error) setStocks(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleProduction = async () => {
    setMsg('Calcul de la formule et déduction des composants...');
    const { error } = await supabase.rpc('execute_production', {
      p_recipe_id: '88888888-8888-8888-8888-888888888888',
      p_quantity: parseInt(prodQty)
    });

    if (error) setMsg('❌ Erreur: ' + error.message);
    else {
      setMsg(`✅ Fabrication de ${prodQty} parfums réussie ! Matières premières et flacons déduits du stock.`);
      loadData();
    }
  };

  const handleSale = async (articleId) => {
    const { error } = await supabase.from('movements').insert([
      { article_id: articleId, type: 'VENTE', qty_in: 0, qty_out: 1, reason: 'Vente Comptoir' }
    ]);
    if (!error) {
      setMsg('✅ Vente enregistrée (1 article).');
      loadData();
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '950px', margin: '0 auto', background: '#fafafa', minHeight: '100vh' }}>
      <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>🪔 Gestion de Stock Parfumerie Cloud</h1>
      {msg && <p style={{ padding: '12px', background: '#d4edda', color: '#155724', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold' }}>{msg}</p>}

      <div style={{ background: '#fff', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, color: '#34495e' }}>🏭 Production Parfum (Sauvage 50ml)</h3>
        <p style={{ fontSize: '14px', color: '#7f8c8d' }}>Déduction automatique par unité: 15ml Essence + 35ml Alcool + 0.5ml Fixateur + 1 Flacon + 1 Bouchon + 1 Boîte.</p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="number" 
            value={prodQty} 
            onChange={(e) => setProdQty(e.target.value)} 
            style={{ padding: '10px', width: '100px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }} 
          />
          <button onClick={handleProduction} style={{ padding: '10px 20px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
            Lancer la production
          </button>
        </div>
      </div>

      <h2 style={{ color: '#2c3e50' }}>📦 État du Stock en Temps Réel</h2>
      {loading ? <p>Connexion au serveur Cloud...</p> : (
        <table border="0" cellPadding="12" style={{ width: '100%', background: '#fff', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ background: '#2c3e50', color: '#fff', textAlign: 'left' }}>
              <th>Code</th>
              <th>Désignation</th>
              <th>Type</th>
              <th>Stock Actuel</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(item => (
              <tr key={item.article_id} style={{ borderBottom: '1px solid #eee' }}>
                <td><code>{item.code}</code></td>
                <td><strong>{item.designation}</strong></td>
                <td><span style={{ padding: '4px 8px', background: '#e2e8f0', borderRadius: '4px', fontSize: '12px' }}>{item.type}</span></td>
                <td style={{ fontWeight: 'bold', fontSize: '16px', color: item.current_stock < 20 ? '#e74c3c' : '#27ae60' }}>
                  {item.current_stock} {item.unite}
                </td>
                <td>
                  {item.type === 'PRODUIT_FINI' && (
                    <button onClick={() => handleSale(item.article_id)} style={{ padding: '6px 12px', background: '#2980b9', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Vendre 1 Unité 🛍️
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
