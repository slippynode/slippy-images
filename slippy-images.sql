CREATE TABLE users (
    users_id SERIAL PRIMARY KEY,
    username VARCHAR (25) UNIQUE,
    email VARCHAR (100) UNIQUE,
    password VARCHAR,
    lockout_enabled BOOLEAN DEFAULT FALSE,
    lockout_end_date TIMESTAMP,
    registration_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_anonymous (
    users_anonymous_id SERIAL PRIMARY KEY,
    ip_address VARCHAR,
    created_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_preferences (
    users_preferences_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    night_mode BOOLEAN DEFAULT FALSE,
    bio VARCHAR (500),
    public_votes BOOLEAN DEFAULT TRUE,
    public_comments BOOLEAN DEFAULT TRUE,
    allow_nsfw BOOLEAN DEFAULT TRUE,
    edited_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_login (
    users_login_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    last_login_ip VARCHAR,
    last_login_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_banned (
    users_banned_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id),
    banned_by_users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    reason VARCHAR (150),
    banned_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submissions (
    submissions_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    title VARCHAR (200),
    likes INTEGER DEFAULT 1,
    dislikes INTEGER DEFAULT 0,
    votes INTEGER DEFAULT 1,
    private BOOLEAN DEFAULT FALSE,
    anonymous BOOLEAN,
    created_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submissions_files (
    submissions_files_id SERIAL PRIMARY KEY,
    submissions_id INTEGER REFERENCES submissions(submissions_id)
        ON DELETE CASCADE,
    users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE DEFAULT NULL,
    size VARCHAR (10),
    directory VARCHAR (255),
    original_name VARCHAR (255),
    caption VARCHAR (5000),
    upload_ip VARCHAR (12),
    uploaded_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submissions_comments (
    submissions_comments_id SERIAL PRIMARY KEY,
    submissions_id INTEGER REFERENCES submissions(submissions_id)
        ON DELETE CASCADE,
    users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE DEFAULT NULL,
    body VARCHAR (2500),
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    votes INTEGER DEFAULT 0,
    anonymous BOOLEAN,
    created_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_notifications (
    users_notifications_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE DEFAULT NULL,
    submissions_comments_id INTEGER REFERENCES
        submissions_comments(submissions_comments_id) ON DELETE CASCADE,
    submissions_id INTEGER REFERENCES submissions(submissions_id)
        ON DELETE CASCADE,
    notification_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_submissions_saves (
    users_submissions_saves_id SERIAL PRIMARY KEY,
    submissions_id INTEGER REFERENCES submissions(submissions_id)
        ON DELETE CASCADE,
    users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    saved_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_submissions_votes (
    users_submissions_votes_id SERIAL PRIMARY KEY,
    submissions_id INTEGER REFERENCES submissions(submissions_id)
        ON DELETE CASCADE,
    users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    vote VARCHAR (10),
    votes_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    tags_id SERIAL PRIMARY KEY,
    name VARCHAR (50),
    created_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submissions_tags (
    submissions_tags_id SERIAL PRIMARY KEY,
    submissions_id INTEGER REFERENCES submissions(submissions_id)
        ON DELETE CASCADE,
    tags_id INTEGER REFERENCES tags(tags_id) ON DELETE CASCADE
);

ALTER TABLE users OWNER TO slippyimages_user;
ALTER TABLE users_anonymous OWNER TO slippyimages_user;
ALTER TABLE users_login OWNER TO slippyimages_user;
ALTER TABLE users_banned OWNER TO slippyimages_user;
ALTER TABLE users_notifications OWNER TO slippyimages_user;
ALTER TABLE users_submissions_saves OWNER TO slippyimages_user;
ALTER TABLE users_submissions_votes OWNER TO slippyimages_user;
ALTER TABLE submissions OWNER TO slippyimages_user;
ALTER TABLE submissions_files OWNER TO slippyimages_user;
ALTER TABLE submissions_comments OWNER TO slippyimages_user;
ALTER TABLE tags OWNER TO slippyimages_user;
ALTER TABLE submissions_tags OWNER TO slippyimages_user;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO slippyimages_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO slippyimages_user;