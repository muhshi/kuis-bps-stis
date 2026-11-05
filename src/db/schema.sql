-- Skema Database Kuis Sosialisasi STIS & BPS (PostgreSQL)
-- Safe schema: CREATE TABLE IF NOT EXISTS

CREATE TABLE IF NOT EXISTS participants (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    nama_clean VARCHAR(100) NOT NULL,
    sekolah VARCHAR(150) NOT NULL,
    sekolah_clean VARCHAR(150) NOT NULL,
    wa VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_sessions (
    id VARCHAR(64) PRIMARY KEY,
    participant_id INT REFERENCES participants(id) ON DELETE CASCADE,
    question_ids INT[] NOT NULL,
    total_score INT DEFAULT 0,
    total_time_ms INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    badge_title VARCHAR(100),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS quiz_answers (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(64) REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    question_id INT NOT NULL,
    chosen_option VARCHAR(5) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent_ms INT NOT NULL DEFAULT 0,
    score_awarded INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_session_question UNIQUE(session_id, question_id)
);

-- Indeks Teroptimasi untuk Live Leaderboard TV & Agregasi Cepat
CREATE INDEX IF NOT EXISTS idx_sessions_leaderboard 
ON quiz_sessions(total_score DESC, total_time_ms ASC) 
WHERE finished_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_participants_school 
ON participants(sekolah_clean);

CREATE INDEX IF NOT EXISTS idx_answers_question 
ON quiz_answers(question_id, is_correct);
