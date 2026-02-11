
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lykjeuuguglwujknhhhw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a2pldXVndWdsd3Vqa25oaGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjUxODYsImV4cCI6MjA4NjI0MTE4Nn0.Z0kxmygufP23YLTVpqLduoQ1rI740N5tv10HFZlQTPw';

export const supabase = createClient(supabaseUrl, supabaseKey);
