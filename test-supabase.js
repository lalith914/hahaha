import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nyfndnamjyfurtkkclmv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Zm5kbmFtanlmdXJ0a2tjbG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMDA5ODAsImV4cCI6MjA4MDU3Njk4MH0.8eT-XatC1ul3G9Gp4ykWi0vBtX0EUJYpwU_DAtBcum4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase
      .from('foods')
      .select('count', { count: 'exact' });
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Connection successful! Foods in database:', data);
    }
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testConnection();
