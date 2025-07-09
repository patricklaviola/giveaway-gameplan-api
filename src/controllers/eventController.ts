import { Request, Response, NextFunction } from 'express';
import { QueryResult } from 'pg';

import pool from '../db.js';
import { Event } from '../models/event.js';

const columns = [
  'league',
  'team_name',
  'event_name',
  'raw_name',
  'matchup',
  'start_date',
  'end_date',
  'description',
  'time_and_zone',
  'location',
  'offer_url',
];

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid ID parameter' });
      return;
    }
    const { rows }: QueryResult<Event> = await pool.query('SELECT * FROM events WHERE id = $1;', [
      id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: `Event with id ${id} not found` });
      return;
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }

  // Optional improvements
  // validate with Zod or Joi
  // log not-found attempts (only if useful for audit/debug)
  //      console.warn(`GET /events/${id} - Not found`);
};

export const getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rows }: QueryResult<Event> = await pool.query('SELECT * FROM events;');
    if (!Array.isArray(rows)) {
      res.status(500).json({ error: 'Failed to retrieve events' });
      return;
    }
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }

  // optional improvements:
  // add LIMIT and OFFSET query params
  // logging: log the number of events returned in debug mode
  // schema validation (with Zod or Joi). If your DB ever changes and returns unexpected types, validating at the API layer helps prevent silent data issues.
};

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      league,
      teamName,
      eventName,
      rawName,
      matchup,
      startDate,
      endDate,
      description,
      timeAndZone,
      location,
      offerURL,
    } = req.body as Event;

    // move to middleware if needed
    if (
      !league ||
      !teamName ||
      !eventName ||
      !rawName ||
      !matchup ||
      !startDate ||
      !endDate ||
      !description ||
      !timeAndZone ||
      !location ||
      !offerURL
    ) {
      res.status(400).json({ error: 'Missing required event fields' });
      return;
    }

    const { rows }: QueryResult<Event> = await pool.query(
      `
      INSERT INTO events (${columns.join(', ')})
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
      `,
      [
        league,
        teamName,
        eventName,
        rawName,
        matchup,
        startDate,
        endDate,
        description,
        timeAndZone,
        location,
        offerURL,
      ],
    );

    if (rows.length === 0) {
      res.status(500).json({ error: 'Insert succeeded but no event was returned' });
      return;
    }

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }

  // optional
  // Use Zod or Joi for proper runtime validation of req.body, especially if the API is public-facing.
  // Trim strings or sanitize inputs before inserting to avoid junk data.
};

export const createManyEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events: Event[] = req.body;

    if (!Array.isArray(events) || events.length === 0) {
      res.status(400).json({ error: 'Request body must be a non-empty array' });
      return;
    }

    const placeholders: string[] = [];
    const values: string[] = [];

    events.forEach((event, i) => {
      const baseIndex = i * columns.length;
      const rowPlaceholders = columns.map((_, j) => `$${baseIndex + j + 1}`).join(', ');
      placeholders.push(`(${rowPlaceholders})`);

      values.push(
        event.league,
        event.teamName,
        event.eventName,
        event.rawName,
        event.matchup,
        event.startDate,
        event.endDate,
        event.description,
        event.timeAndZone,
        event.location,
        event.offerURL,
      );
    });

    const query = `
        INSERT INTO events (${columns.join(', ')})
        VALUES ${placeholders.join(', ')}
    `;

    const result: QueryResult = await pool.query(query, values);
    res.status(201).json({ inserted: result.rowCount });
  } catch (err) {
    next(err);
  }
  // OPTIONAL
  // Validate each event using Zod/Joi if you're worried about malformed input.
  // Wrap the query in a transaction if this table has dependencies (e.g. foreign keys).
  // Use a map function instead of forEach if you prefer functional style (but you’d need to flatten a 2D array).
};

export const deleteEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid ID parameter' });
      return;
    }

    const { rows }: QueryResult<Event> = await pool.query(
      'DELETE FROM events WHERE id = $1 RETURNING *;',
      [id],
    );

    if (rows.length === 0) {
      res.status(404).json({ error: `Event with id ${id} not found` });
      return;
    }
    res.status(200).json({
      message: `Event with id ${id} was deleted`,
      deletedEvent: rows[0],
    });
  } catch (error) {
    next(error);
  }
  // OPTIONAL
  // Add logging for successful or failed deletions if you want an audit trail.
  // If this endpoint is protected, make sure you're validating auth/ownership upstream.
};

export const deleteAllEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rowCount }: QueryResult = await pool.query('DELETE FROM events;');

    res.status(200).json({
      message: 'All events deleted successfully',
      deletedCount: rowCount,
    });
  } catch (err) {
    next(err);
  }
  // OPTIONAL
  // Add a confirmation step or auth middleware for safety. Deleting everything is a dangerous operation, especially in production.
  // Wrap in a transaction if deleting from related tables (e.g. dependent child tables), to ensure atomic cleanup.
};
