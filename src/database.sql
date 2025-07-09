CREATE DATABASE giveaway_gameplan;

CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    league TEXT NOT NULL,
    team_name TEXT NOT NULL,
    event_name TEXT NOT NULL,
    raw_name TEXT,
    matchup TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    time_and_zone TEXT,
    location TEXT,
    offer_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TABLE IF EXISTS events;

CREATE INDEX idx_events_league_team_date ON events(league, team, start_date);
