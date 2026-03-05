import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://npufzqnfdbevqpqmojms.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjY1ZDUwZDY1LWYxNGQtNDEzNC1hNzk5LTQ3NWNiZmEyNDczNCJ9.eyJwcm9qZWN0SWQiOiJucHVmenFuZmRiZXZxcHFtb2ptcyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcyNjM5Mjc4LCJleHAiOjIwODc5OTkyNzgsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.xrtiHaHHrMgSmglzmJO0uJOjDwLXcFv-KcCXTix1X2U';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };