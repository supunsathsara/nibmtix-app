import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://mwsjezpvwhcatnyrumey.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13c2plenB2d2hjYXRueXJ1bWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI5NjY1NTksImV4cCI6MjAzODU0MjU1OX0.wDmh-klhDbcYg30dPX6EXWRiYAZ5uFFaAJ_tf_UlGqc";


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
