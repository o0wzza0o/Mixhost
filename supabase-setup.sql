-- Supabase Setup Script for Quiz System
-- Paste this in the SQL Editor and click Run

-- 1. Create the scores table
CREATE TABLE IF NOT EXISTS scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    quiz TEXT NOT NULL,
    ip TEXT DEFAULT 'unknown',
    date TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow insert" ON scores;
DROP POLICY IF EXISTS "Allow select" ON scores;
DROP POLICY IF EXISTS "Allow delete" ON scores;
DROP POLICY IF EXISTS "Enable insert for all" ON scores;
DROP POLICY IF EXISTS "Enable select for all" ON scores;
DROP POLICY IF EXISTS "Enable delete for all" ON scores;

-- 4. Create policies for anonymous access
CREATE POLICY "Enable insert for all" ON scores
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Enable select for all" ON scores
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Enable delete for all" ON scores
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- 5. Grant permissions to anonymous users
GRANT ALL ON scores TO anon;
GRANT ALL ON scores TO authenticated;

-- Success message (will appear in output)
SELECT '✅ Table "scores" created successfully with RLS policies!' as status;
