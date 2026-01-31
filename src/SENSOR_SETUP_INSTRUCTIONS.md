# ESP32 Sensor Setup Instructions

## Overview

Your water plant safety monitoring system is now configured to receive real-time sensor data from your ESP32. The system monitors pH, ORP (Oxidation-Reduction Potential), and Conductivity to detect dangerous conditions and automatically cut power to chemical pumps when necessary.

## System Architecture

```
ESP32 Sensors → WiFi → Supabase Backend → Web Dashboard
```

1. **ESP32** reads sensor values every 2 seconds
2. **Backend API** receives and stores the data
3. **Web Dashboard** displays real-time charts and alerts

## Backend Endpoints

Your Supabase backend now has these endpoints:

### 1. **POST Sensor Data** (for ESP32)
```
POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c0d5887d/sensor-data

Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_SUPABASE_ANON_KEY

Body:
{
  "pH": 7.2,
  "orp": 650,
  "conductivity": 500,
  "timestamp": 1234567890
}
```

### 2. **GET Latest Reading**
```
GET https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c0d5887d/sensor-data/latest
```

### 3. **GET Sensor History**
```
GET https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c0d5887d/sensor-data/history?limit=50
```

### 4. **GET Event Logs**
```
GET https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c0d5887d/event-logs?limit=100
```

## ESP32 Setup Steps

### 1. **Install Required Libraries**

Open Arduino IDE and install these libraries via Library Manager:
- `WiFi` (built-in for ESP32)
- `HTTPClient` (built-in for ESP32)
- `ArduinoJson` by Benoit Blanchon

### 2. **Get Your Credentials**

You need two pieces of information from your Supabase dashboard:

1. **Project ID**: Found in your Supabase project URL
   - Example: `https://abcdefgh12345678.supabase.co`
   - Your Project ID is: `abcdefgh12345678`

2. **Anonymous Key**: Found in Project Settings → API
   - Copy the `anon` / `public` key (NOT the service_role key!)

### 3. **Configure the ESP32 Code**

Open `ESP32_SENSOR_CODE.ino` and update these values:

```cpp
// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";           // Your WiFi name
const char* password = "YOUR_WIFI_PASSWORD";   // Your WiFi password

// Backend API endpoint
const char* serverUrl = "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c0d5887d/sensor-data";

// Supabase anonymous key
const char* apiKey = "YOUR_SUPABASE_ANON_KEY";
```

### 4. **Connect Your Sensors**

Connect your sensors to the ESP32:

| Sensor        | ESP32 Pin | Notes                           |
|---------------|-----------|----------------------------------|
| pH Sensor     | GPIO 34   | Analog input, 0-3.3V            |
| ORP Sensor    | GPIO 35   | Analog input, 0-3.3V            |
| Conductivity  | GPIO 32   | Analog input, 0-3.3V            |
| Ground        | GND       | Common ground for all sensors   |
| Power         | 3.3V/5V   | Check your sensor requirements  |

**Important**: Most pH, ORP, and conductivity sensors output analog signals. Make sure your sensors are compatible with 3.3V logic or use appropriate level shifters.

### 5. **Calibrate Your Sensors**

Before deployment, calibrate each sensor:

#### pH Sensor Calibration:
1. Use pH 4.0, 7.0, and 10.0 buffer solutions
2. Adjust `pH_OFFSET` and `pH_SCALE` in the code
3. Test with known pH values

#### ORP Sensor Calibration:
1. Use a standard ORP solution (typically 220mV or 470mV)
2. Adjust `ORP_OFFSET` and `ORP_SCALE`
3. Verify readings

#### Conductivity Sensor Calibration:
1. Use standard conductivity solutions (e.g., 1413 μS/cm)
2. Adjust `COND_OFFSET` and `COND_SCALE`
3. Test with distilled water (should read near 0)

### 6. **Upload and Test**

1. Connect ESP32 to your computer via USB
2. Select the correct board: `Tools → Board → ESP32 Dev Module`
3. Select the correct port: `Tools → Port → (your ESP32 port)`
4. Click **Upload**
5. Open Serial Monitor (115200 baud) to view logs

### 7. **Verify Data Flow**

Once the ESP32 is running:

1. Check Serial Monitor for successful WiFi connection
2. Verify sensor readings are being sent (you'll see HTTP 200 responses)
3. Open your web dashboard and navigate to "Real-Time Monitoring"
4. You should see live data updating every 2 seconds

## Safety Thresholds

The system monitors pH levels and automatically changes state:

| State    | Condition                                      | Action                          |
|----------|------------------------------------------------|---------------------------------|
| **SAFE** | pH between 6.8-8.0, slow rate of change       | Normal operation                |
| **WARNING** | pH between 6.5-6.8 or 8.0-8.5, OR rapid change | Alert displayed                 |
| **CRITICAL** | pH below 6.5 or above 8.5                   | PUMP POWER SEVERED (red alert)  |

## Troubleshooting

### ESP32 Won't Connect to WiFi
- Double-check WiFi SSID and password
- Ensure WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
- Check WiFi signal strength

### Sensor Readings Look Wrong
- Verify sensor connections (VCC, GND, Signal)
- Check sensor power requirements (3.3V vs 5V)
- Recalibrate sensors with known solutions
- Verify analog pins are configured correctly

### Data Not Appearing in Dashboard
- Check Serial Monitor for HTTP response codes
- Verify Supabase credentials are correct
- Check that serverUrl includes correct project ID
- Ensure Anonymous Key is the `anon` key, not `service_role`

### HTTP Error Codes
- **400**: Missing or invalid sensor data in request
- **401**: Invalid API key
- **404**: Endpoint not found (check serverUrl)
- **500**: Server error (check backend logs)

## Testing Without Hardware

If you want to test the system before connecting physical sensors, you can use this simple curl command:

```bash
curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c0d5887d/sensor-data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -d '{
    "pH": 7.2,
    "orp": 650,
    "conductivity": 500
  }'
```

## Next Steps

1. **Hardware Integration**: Connect your ESP32 to a relay module to physically cut pump power when critical alerts occur
2. **Alert Notifications**: Add email/SMS notifications for critical events
3. **Historical Analytics**: Analyze trends over time to predict failures
4. **Multiple Sensors**: Scale to monitor multiple water treatment stations

## Support

For issues or questions:
- Check the Serial Monitor output for detailed error messages
- Verify all connections and credentials
- Review the backend logs in Supabase dashboard

---

**Remember**: This is a prototype system. For production deployment in critical infrastructure, implement additional safety measures, redundancy, and professional calibration.
