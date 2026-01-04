
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    releaseDate DATE NOT NULL,
    platform VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (platform IN ('PlayStation', 'Xbox', 'Nintendo Switch', 'PC', 'Mobile', 'Web'))
);


CREATE INDEX idx_games_title ON games(title);


CREATE INDEX idx_games_platform ON games(platform);


CREATE INDEX idx_games_genre ON games(genre);