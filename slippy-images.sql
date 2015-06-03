CREATE TABLE users (
    users_id SERIAL PRIMARY KEY,
    username VARCHAR (25),
    email VARCHAR (100),
    password VARCHAR (25),
    lockout_enabled BOOLEAN,
    lockout_end_date TIMESTAMP,
    registration_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_login (
    users_login_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id),
    last_login_ip VARCHAR (12),
    last_login_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_banned (
    users_banned_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id),
    banned_by_users_id INTEGER REFERENCES users(users_id),
    reason VARCHAR (150),
    banned_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE files (
    files_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id) DEFAULT NULL,
    hash VARCHAR (255),
    original_name VARCHAR (255),
    name VARCHAR (30),
    size VARCHAR (10),
    directory VARCHAR (255),
    likes INTEGER,
    dislikes INTEGER,
    votes INTEGER,
    upload_ip VARCHAR (12),
    uploaded_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_files_saves (
    users_files_saves_id SERIAL PRIMARY KEY,
    files_id INTEGER REFERENCES files(files_id),
    users_id INTEGER REFERENCES users(users_id),
    saved_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_files_votes (
    users_files_votes_id SERIAL PRIMARY KEY,
    files_id INTEGER REFERENCES files(files_id),
    users_id INTEGER REFERENCES users(users_id),
    vote VARCHAR (10),
    votes_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    tags_id SERIAL PRIMARY KEY,
    name VARCHAR (50)
);

CREATE TABLE files_tags (
    files_tags_id SERIAL PRIMARY KEY,
    files_id INTEGER REFERENCES files(files_id),
    tags_id INTEGER REFERENCES tags(tags_id)
);

ALTER TABLE users OWNER TO slippyimages_user;
ALTER TABLE users_login OWNER TO slippyimages_user;
ALTER TABLE users_banned OWNER TO slippyimages_user;
ALTER TABLE users_files_saves OWNER TO slippyimages_user;
ALTER TABLE users_files_votes OWNER TO slippyimages_user;
ALTER TABLE files OWNER TO slippyimages_user;
ALTER TABLE tags OWNER TO slippyimages_user;
ALTER TABLE files_tags OWNER TO slippyimages_user;