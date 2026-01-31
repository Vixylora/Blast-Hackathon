import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c0d5887d/health", (c) => {
  return c.json({ status: "ok" });
});

// ESP32 endpoint to receive sensor data
app.post("/make-server-c0d5887d/sensor-data", async (c) => {
  try {
    const body = await c.req.json();
    const { pH, orp, conductivity, timestamp } = body;

    // Validate required fields
    if (pH === undefined || orp === undefined || conductivity === undefined) {
      console.log(`Sensor data validation error: Missing required fields in ${JSON.stringify(body)}`);
      return c.json({ error: "Missing required fields: pH, orp, conductivity" }, 400);
    }

    // Create sensor reading object
    const sensorReading = {
      pH: parseFloat(pH),
      orp: parseFloat(orp),
      conductivity: parseFloat(conductivity),
      timestamp: timestamp || Date.now(),
    };

    // Store in KV store using timestamp as key
    const key = `sensor_reading_${sensorReading.timestamp}`;
    await kv.set(key, sensorReading);

    // Also store the latest reading for quick access
    await kv.set('latest_sensor_reading', sensorReading);

    console.log(`Stored sensor reading: ${JSON.stringify(sensorReading)}`);

    return c.json({ 
      success: true, 
      message: "Sensor data received",
      data: sensorReading 
    });
  } catch (error) {
    console.log(`Error storing sensor data: ${error}`);
    return c.json({ error: "Failed to store sensor data", details: String(error) }, 500);
  }
});

// Get latest sensor reading
app.get("/make-server-c0d5887d/sensor-data/latest", async (c) => {
  try {
    const latest = await kv.get('latest_sensor_reading');
    
    if (!latest) {
      return c.json({ error: "No sensor data available" }, 404);
    }

    return c.json(latest);
  } catch (error) {
    console.log(`Error retrieving latest sensor data: ${error}`);
    return c.json({ error: "Failed to retrieve sensor data", details: String(error) }, 500);
  }
});

// Get sensor readings history
app.get("/make-server-c0d5887d/sensor-data/history", async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    
    // Get all sensor readings
    const allReadings = await kv.getByPrefix('sensor_reading_');
    
    // Sort by timestamp descending and limit
    const sortedReadings = allReadings
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);

    return c.json({ 
      count: sortedReadings.length,
      data: sortedReadings 
    });
  } catch (error) {
    console.log(`Error retrieving sensor data history: ${error}`);
    return c.json({ error: "Failed to retrieve sensor history", details: String(error) }, 500);
  }
});

// Log event endpoint (for when system state changes)
app.post("/make-server-c0d5887d/log-event", async (c) => {
  try {
    const body = await c.req.json();
    const { type, message, systemState, sensorData } = body;

    const eventLog = {
      type,
      message,
      systemState,
      sensorData,
      timestamp: Date.now(),
    };

    // Store event log
    const key = `event_log_${eventLog.timestamp}`;
    await kv.set(key, eventLog);

    console.log(`Logged event: ${JSON.stringify(eventLog)}`);

    return c.json({ 
      success: true, 
      message: "Event logged",
      data: eventLog 
    });
  } catch (error) {
    console.log(`Error logging event: ${error}`);
    return c.json({ error: "Failed to log event", details: String(error) }, 500);
  }
});

// Get event logs
app.get("/make-server-c0d5887d/event-logs", async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '100');
    
    // Get all event logs
    const allLogs = await kv.getByPrefix('event_log_');
    
    // Sort by timestamp descending and limit
    const sortedLogs = allLogs
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);

    return c.json({ 
      count: sortedLogs.length,
      data: sortedLogs 
    });
  } catch (error) {
    console.log(`Error retrieving event logs: ${error}`);
    return c.json({ error: "Failed to retrieve event logs", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);