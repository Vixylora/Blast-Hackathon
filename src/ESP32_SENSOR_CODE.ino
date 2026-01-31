/*
 * ESP32 Water Plant Safety Monitoring System
 * 
 * This code reads pH, ORP, and Conductivity sensors and sends
 * the data to your Supabase backend via HTTP POST requests.
 * 
 * Hardware Setup:
 * - pH Sensor: Connect to analog pin (e.g., GPIO34)
 * - ORP Sensor: Connect to analog pin (e.g., GPIO35)
 * - Conductivity Sensor: Connect to analog pin (e.g., GPIO32)
 * 
 * Make sure to calibrate your sensors before use!
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ====== CONFIGURATION - UPDATE THESE VALUES ======

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API endpoint
// Replace YOUR_PROJECT_ID with your actual Supabase project ID
const char* serverUrl = "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c0d5887d/sensor-data";

// Supabase anonymous key
// Replace with your actual Supabase anonymous key
const char* apiKey = "YOUR_SUPABASE_ANON_KEY";

// Sensor pins
const int pH_PIN = 34;
const int ORP_PIN = 35;
const int CONDUCTIVITY_PIN = 32;

// Calibration constants (adjust these based on your sensor calibration)
const float pH_OFFSET = 0.0;           // pH offset from calibration
const float pH_SCALE = 3.5;            // pH scaling factor
const float ORP_OFFSET = 0.0;          // ORP offset (mV)
const float ORP_SCALE = 59.16;         // ORP scaling factor
const float COND_OFFSET = 0.0;         // Conductivity offset
const float COND_SCALE = 1.0;          // Conductivity scaling factor

// Sampling interval (milliseconds)
const unsigned long SAMPLING_INTERVAL = 2000; // Send data every 2 seconds

// ====== END CONFIGURATION ======

unsigned long lastSampleTime = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n=================================");
  Serial.println("ESP32 Water Safety Monitor");
  Serial.println("=================================\n");
  
  // Connect to WiFi
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi Connection Failed!");
    Serial.println("Please check your credentials and restart.");
  }
  
  // Configure ADC
  analogReadResolution(12); // 12-bit resolution (0-4095)
  analogSetAttenuation(ADC_11db); // Full range: 0-3.3V
  
  Serial.println("\nSensor monitoring started...\n");
}

void loop() {
  unsigned long currentTime = millis();
  
  // Check if it's time to sample
  if (currentTime - lastSampleTime >= SAMPLING_INTERVAL) {
    lastSampleTime = currentTime;
    
    // Read sensors
    float pH = readpH();
    float orp = readORP();
    float conductivity = readConductivity();
    
    // Display readings
    Serial.println("--- Sensor Readings ---");
    Serial.print("pH: ");
    Serial.println(pH, 2);
    Serial.print("ORP: ");
    Serial.print(orp, 1);
    Serial.println(" mV");
    Serial.print("Conductivity: ");
    Serial.print(conductivity, 1);
    Serial.println(" μS/cm");
    
    // Send data to backend
    if (WiFi.status() == WL_CONNECTED) {
      sendSensorData(pH, orp, conductivity);
    } else {
      Serial.println("ERROR: WiFi not connected!");
    }
    
    Serial.println();
  }
}

// Read pH sensor
float readpH() {
  int rawValue = analogRead(pH_PIN);
  float voltage = rawValue * (3.3 / 4095.0);
  
  // Convert voltage to pH (adjust formula based on your sensor)
  // This is a generic formula - calibrate with known pH solutions!
  float pH = pH_SCALE * voltage + pH_OFFSET;
  
  return pH;
}

// Read ORP sensor
float readORP() {
  int rawValue = analogRead(ORP_PIN);
  float voltage = rawValue * (3.3 / 4095.0);
  
  // Convert voltage to ORP in millivolts
  // This is a generic formula - calibrate with known ORP solutions!
  float orp = ((voltage - 1.65) * 1000.0) / ORP_SCALE + ORP_OFFSET;
  
  return orp;
}

// Read Conductivity sensor
float readConductivity() {
  int rawValue = analogRead(CONDUCTIVITY_PIN);
  float voltage = rawValue * (3.3 / 4095.0);
  
  // Convert voltage to conductivity (μS/cm)
  // This is a generic formula - calibrate with known conductivity solutions!
  float conductivity = voltage * COND_SCALE + COND_OFFSET;
  
  return conductivity;
}

// Send sensor data to backend
void sendSensorData(float pH, float orp, float conductivity) {
  HTTPClient http;
  
  // Configure HTTP client
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + apiKey);
  
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["pH"] = pH;
  doc["orp"] = orp;
  doc["conductivity"] = conductivity;
  doc["timestamp"] = millis();
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Send POST request
  Serial.print("Sending data to server... ");
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    Serial.print("Response code: ");
    Serial.println(httpResponseCode);
    
    if (httpResponseCode == 200) {
      String response = http.getString();
      Serial.println("Success! Server response:");
      Serial.println(response);
    }
  } else {
    Serial.print("ERROR: ");
    Serial.println(http.errorToString(httpResponseCode));
  }
  
  http.end();
}
