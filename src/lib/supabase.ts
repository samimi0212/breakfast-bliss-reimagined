import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ommkmxahqxakoixoiiux.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbWtteGFocXhha29peG9paXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NTg5MTYsImV4cCI6MjA4OTEzNDkxNn0.Lk7-ngzycGnqaFWX9zFatA0h0K-7X8PIwepvI5hIqEQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
