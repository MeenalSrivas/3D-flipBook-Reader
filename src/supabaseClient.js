import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rpuhaolugswnrnqtndvy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwdWhhb2x1Z3N3bnJucXRuZHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNzM4MDMsImV4cCI6MjA4MTk0OTgwM30.B_c2CKl-dAnkOvgb8M7UjpZZ638KLw668oIU-LcxEu8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)