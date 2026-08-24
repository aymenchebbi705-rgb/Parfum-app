import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function Home() {
  const [status, setStatus] = useState('جاري الفحص...');

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      setStatus('تنبيه: يلزم إضافة Environment Variables في Vercel');
    } else {
      try {
        createClient(url, key);
        setStatus('تم الاتصال بنجاح بقاعدة البيانات! 🎉');
      } catch (err) {
        setStatus('خطأ في الاتصال: ' + err.message);
      }
    }
  }, []);

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif', textAlign: 'center', direction: 'rtl' }}>
      <h1>نظام إدارة العطورات</h1>
      <p style={{ fontSize: '20px', marginTop: '20px' }}>{status}</p>
    </div>
  );
}
