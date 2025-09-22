const supabase = require('@supabase/supabase-js')
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supaConnect = supabase.createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY);

module.exports = supaConnect;