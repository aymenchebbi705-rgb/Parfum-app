export default function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', direction: 'rtl', textAlign: 'center', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>🧴 نظام إدارة العطورات MOKAÏ</h1>
      <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>مرحباً بك! منصة إدارة المخزون والمبيعات متصلة وجاهزة.</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minWidth: '200px' }}>
          <h3>📦 المخزون</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>متصل</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minWidth: '200px' }}>
          <h3>💰 المبيعات</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>جاهز</p>
        </div>
      </div>
    </div>
  );
}
