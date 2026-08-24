import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function Home() {
  const [supabase, setSupabase] = useState(null);
  const [status, setStatus] = useState('جاري الاتصال بالسيستم...');

  useEffect(() => {
    if (supabaseUrl && supabaseAnonKey) {
      const client = createClient(supabaseUrl, supabaseAnonKey);
      setSupabase(client);
      setStatus('تم الاتصال بنجاح بقاعدة البيانات!');
    } else {
      setStatus('خطأ: مفاتيح Supabase غير مكتملة.');
    }
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', direction: 'rtl' }}>
      <h1>🎉 نظام إدارة العطورات</h1>
      <p style={{ fontSize: '18px', color: status.includes('بنجاح') ? 'green' : 'red' }}>
        {status}
      </p>
    </div>
  );
}
