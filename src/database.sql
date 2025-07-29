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
    location TEXT NOT NULL,
    offer_url TEXT NOT NULL,
    day_of_week TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TABLE IF EXISTS events;

CREATE INDEX idx_events_league_team_date ON events(league, team, start_date);
