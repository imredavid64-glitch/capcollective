---
title: Firmware & IoT Guide
---

# Cap Collective — Firmware & IoT System Guide
### Complete ESP32/ESP32-S3 IoT Bottle Cap Counting System
**Integrates with: `29_IOT_AND_LIVE_TRACKING.md`, `resources/sensor_count.ino`, `16_WEBSITE_AND_DASHBOARD_DEPLOYMENT.md`**

---

## System Architecture

```
┌─────────────────┐     ESP-NOW (2.4 GHz)      ┌─────────────────┐     WiFi/HTTPS      ┌──────────────────┐
│   Node 1        │ ────────────────────────►  │   Radio Tower   │ ────────────────►   │   Supabase       │
│   (ESP32-S3 CAM)│   Channel 1 (configurable) │   (ESP32-S3)    │   REST API        │   PostgreSQL     │
│   Ultrasonic +  │                            │   TFT + OLED    │                   │   Real-time      │
│   Color Camera  │                            │   SD Card Log   │                   │   Subscriptions  │
└─────────────────┘                            └─────────────────┘                   └────────┬─────────┘
       ▲                                                                                      │
       │                                                                                      ▼
       │ ESP-NOW                                                                    ┌──────────────────────────────┐
       └───────────────────────────────────────────────────────────────────────────► │   Web Dashboard (HTML/JS)    │
        (Node 2)                                                                    │   Chart.js + Supabase Realtime│
                                                                                    └──────────────────────────────┘
```

---

## Hardware Bill of Materials

### Node 1 — Cap Counter with Camera (ESP32-S3 CAM)
| Component | Specification | Qty | Est. Cost | Source |
|-----------|---------------|-----|-----------|--------|
| **MCU** | Freenove ESP32-S3 CAM (OV2640) | 1 | $18-25 | Amazon, AliExpress |
| **Ultrasonic** | HC-SR04 or JSN-SR04T (waterproof) | 1 | $2-5 | Amazon |
| **Wiring** | Dupont cables, heat shrink | 1 set | $3 | Hardware store |
| **Enclosure** | 3D printed / project box | 1 | $5-10 | Print yourself |
| **Power** | 5V USB-C PSU or 3.7V LiPo + 5V boost | 1 | $5-10 | Amazon |
| **Total** | | | **$33-53** | |

**Pin Mapping (Node 1):**
| Function | GPIO | Notes |
|----------|------|-------|
| Ultrasonic TRIG | 2 | Output |
| Ultrasonic ECHO | 1 | Input |
| Camera | Built-in | OV2640 on Freenove board |
| ESP-NOW Radio | Internal | 2.4 GHz WiFi radio |

### Node 2 — Basic Cap Counter (ESP32)
| Component | Specification | Qty | Est. Cost |
|-----------|---------------|-----|-----------|
| **MCU** | ESP32 DevKit V1 / ESP32-S3 | 1 | $8-15 |
| **Sensor** | IR Beam-break (FC-51) or Ultrasonic | 1 | $2-5 |
| **Power** | 5V USB / LiPo | 1 | $5 |
| **Total** | | | **$15-25** |

### Radio Tower — Central Hub (ESP32-S3 with PSRAM)
| Component | Specification | Qty | Est. Cost | Pins |
|-----------|---------------|-----|-----------|------|
| **MCU** | ESP32-S3 DevKit (8MB PSRAM min) | 1 | $12-18 | — |
| **TFT Display** | ST7735 1.8" 160×128 SPI | 1 | $8-12 | SCK=21, MOSI=14, CS=47, DC=41, RST=-1 |
| **OLED Display** | SSD1306 0.96" 128×64 I2C | 1 | $5-8 | SDA=1, SCL=2 |
| **SD Card** | MicroSD slot (SD_MMC 4-bit) | 1 | $3-5 | CLK=39, CMD=38, D0=40 |
| **Camera** | OV2640 module (for access gate) | 1 | $5-8 | Standard ESP32-CAM pins |
| **Power** | 5V 2A USB-C PSU | 1 | $5-10 | — |
| **Total** | | | **$38-56** | |

**Pin Mapping (Radio Tower):**
| Function | GPIO | Interface |
|----------|------|-----------|
| TFT SCK | 21 | SPI |
| TFT MOSI | 14 | SPI |
| TFT CS | 47 | SPI |
| TFT DC | 41 | SPI |
| TFT RST | -1 | — |
| OLED SDA | 1 | I2C |
| OLED SCL | 2 | I2C |
| SD CLK | 39 | SD_MMC |
| SD CMD | 38 | SD_MMC |
| SD D0 | 40 | SD_MMC |
| Camera | Standard | ESP32-CAM pins |

---

## Firmware Directory Structure

```
firmware/
├── node1_cap_counter/          # ESP32-S3 CAM + Ultrasonic + Color Detection
│   ├── node1_cap_counter.ino   # Minimal version (ultrasonic only)
│   ├── node1_full.ino          # Full version with camera + TFLite option
│   └── platformio.ini          # PlatformIO config
├── node2_cap_counter/          # Simpler ESP32 cap counter
│   ├── node2_cap_counter.ino   # Main firmware
│   ├── node2_config.h          # Configuration header
│   └── platformio.ini          # PlatformIO config
├── radio_tower/                # Central hub receiver
│   ├── radio_tower.ino         # Full hub firmware
│   └── platformio.ini          # PlatformIO config
├── libraries/                  # Required Arduino libraries (see below)
└── README.md                   # This guide
```

---

## Required Arduino Libraries

Install via Arduino Library Manager or PlatformIO `lib_deps`:

```ini
# Built-in (ESP32 core):
# - WiFi, ESP-NOW, esp_camera, SD_MMC, SPI, Wire, HTTPClient

# External (install via Library Manager):
lib_deps =
    adafruit/Adafruit GFX Library@^1.11.9
    adafruit/Adafruit ST7735 and ST7789 Library@^1.9.4
    adafruit/Adafruit SSD1306@^2.5.7
    bblanchon/ArduinoJson@^7.0.4
```

### Supabase Upload (no extra library)

The Radio Tower talks to Supabase's PostgREST API with the built-in
`HTTPClient` — there is no third-party Supabase library to install:

```cpp
HTTPClient http;
http.begin(String(SB_URL) + "/rest/v1/cap_counts");
http.addHeader("Content-Type", "application/json");
http.addHeader("apikey", SB_ANON);
http.addHeader("Authorization", String("Bearer ") + SB_ANON);
http.addHeader("Prefer", "return=minimal");
int code = http.POST(json);   // 201 on success
```

Compile with `-DSUPABASE_UPLOAD_ENABLED=0` to run offline (SD logging only).

---

## Configuration

### 0. Secrets (never commit credentials)

Each firmware project reads credentials from a **gitignored** `secrets.h`:

```bash
cd firmware/radio_tower
cp secrets.h.example secrets.h     # Windows: copy secrets.h.example secrets.h
```

```cpp
#define SECRET_WIFI_SSID "YourWiFiSSID"
#define SECRET_WIFI_PASS "YourWiFiPassword"
#define SECRET_SB_URL    "https://your-project.supabase.co"
#define SECRET_SB_ANON   "your-anon-key"
```

### 1. Radio Channel (MUST match on ALL devices)
```cpp
// In each project's secrets.h
#define SECRET_RADIO_CHANNEL 1   // Change 1-13 if interference
```

### 2. Tower MAC Address (on Nodes)
```cpp
// In firmware/node1_cap_counter/src/main.ino and
//     firmware/node2_cap_counter/src/main.ino
static uint8_t TOWER_MAC[6] = {0x14,0xC1,0x9F,0x29,0xFD,0xA4};  // REPLACE WITH YOUR TOWER'S MAC
```

**Get Tower MAC:** Boot Radio Tower → Serial Monitor shows `>> Tower MAC: 14:C1:9F:29:FD:A4`

### 3. WiFi & Supabase (Radio Tower only)

Put these in `secrets.h` — never in the tracked `.ino` file:

```cpp
#define SECRET_WIFI_SSID "YourWiFiSSID"
#define SECRET_WIFI_PASS "YourWiFiPassword"
#define SECRET_SB_URL    "https://your-project.supabase.co"
#define SECRET_SB_ANON   "your-anon-key-from-supabase-settings"
```

### 4. Supabase Database Setup
```sql
-- Run in Supabase SQL Editor
create table cap_counts (
  id bigserial primary key,
  created_at timestamp with time zone default now(),
  node_id smallint not null,
  cap_count integer not null,
  cap_color text not null
);

-- Enable realtime for live dashboard
alter publication supabase_realtime add table cap_counts;

-- Optional: Index for faster queries
create index idx_cap_counts_node_time on cap_counts(node_id, created_at desc);
create index idx_cap_counts_color on cap_counts(cap_color);
```

### 5. Ultrasound Thresholds (Node 1)
```cpp
#define CAP_DETECT_CM  5.0f    // Detect cap when object < 5cm
#define DEBOUNCE_MS    800     // Minimum time between counts
```

### 6. Access Gate Tuning (Radio Tower)
```cpp
#define SKIN_TRIGGER_PCT     8    // % skin pixels to trigger
#define SKIN_HOLD_FRAMES     5    // Consecutive frames required
#define SKIN_SCAN_INTERVAL   150  // ms between scans
#define ACCESS_TIMEOUT_MS    60000 // Auto-grant after 60s
```

---

## Data Protocol (ESP-NOW)

### CapMessage (Node → Tower)
```cpp
typedef struct __attribute__((packed)) {
  uint8_t  node_id;       // 1 or 2
  uint16_t cap_count;     // Running total from this node
  uint8_t  color_idx;     // 0=red, 1=blue, 2=green, 3=white, 4=unknown
  uint32_t timestamp_ms;  // Millis since node boot
} CapMessage;  // 8 bytes total
```

### Event Log (Tower SD Card)
```csv
uptime_ms,node_id,cap_count,color
123456,1,42,red
124001,2,15,blue
```

---

## Flashing Instructions

### PlatformIO (Recommended)
```bash
# Install PlatformIO CLI
pip install platformio

# Node 1
cd firmware/node1_cap_counter
pio run -t upload
pio device monitor

# Node 2
cd firmware/node2_cap_counter
pio run -t upload
pio device monitor

# Radio Tower
cd firmware/radio_tower
pio run -t upload
pio device monitor
```

### Arduino IDE
1. **Add ESP32 board support:**
   - File → Preferences → Additional Board Manager URLs:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
   - Tools → Board → Boards Manager → Search "esp32" → Install "ESP32 by Espressif Systems"

2. **Select boards:**
   - Node 1: "ESP32S3 Dev Module" (or "Freenove ESP32-S3 CAM")
   - Node 2: "ESP32 Dev Module" or "ESP32S3 Dev Module"
   - Radio Tower: "ESP32S3 Dev Module"

3. **Critical settings for Camera:**
   - Tools → Partition Scheme: **"Huge APP (3MB No OTA/1MB SPIFFS)"**
   - Tools → PSRAM: **"Enabled"**
   - Tools → Flash Mode: **"QIO"** (for PSRAM)

4. **Install libraries** via Sketch → Include Library → Manage Libraries

5. **Upload each sketch** (Ctrl+U)

---

## Web Dashboard (Supabase-Powered)

Location: `web/supabase_dashboard/index.html`

### Features
- **Real-time totals** per node with "live" indicator
- **24-hour hourly trend** (Chart.js line chart)
- **Color distribution** (Chart.js doughnut chart)
- **Node health** (online/offline based on last seen < 2 min)
- **Recent events table** with color-coded dots
- **Supabase Realtime** subscriptions for instant updates

### Deploy Dashboard

**Option 1: Static Hosting (Netlify, Vercel, GitHub Pages)**
```bash
# Just upload the web/supabase_dashboard/ folder
# No build step needed — pure HTML/JS
```

**Option 2: Supabase Edge Function**
```bash
supabase functions deploy dashboard --no-verify-jwt
```

**Option 3: Local Development**
```bash
cd web/supabase_dashboard
npx serve .
# Opens at http://localhost:3000
```

### Dashboard Configuration
Edit `web/supabase_dashboard/index.html`:
```javascript
const SB_URL  = 'https://your-project.supabase.co';
const SB_ANON = 'your-anon-key';  // Safe to expose in client (anon key)
```

---

## Integration with Main Kit

### Command Center Sheets (`03_COMMAND_CENTER_SHEETS.md`)
The IoT system feeds data into Tab 8: **Sensor Data Log**

| Column | Source |
|--------|--------|
| Timestamp | Supabase `created_at` |
| Bin ID | `NODE-1` or `NODE-2` |
| Count | `cap_count` |
| Fill % | Calculated (cap_count / 2000 * 100) |
| Temperature | N/A (add temp sensor if needed) |
| Status | `OK` / `ALERT` |

### Google Apps Script Webhook Alternative
If not using Supabase, use the existing `resources/sensor_count.ino` → Apps Script → Sheets pipeline documented in `29_IOT_AND_LIVE_TRACKING.md`.

### Dashboard Deployment (`16_WEBSITE_AND_DASHBOARD_DEPLOYMENT.md`)
The Supabase dashboard replaces Option A (Looker Studio) for real-time IoT data. Use both:
- **Looker Studio** → Historical/aggregated data from Command Center Sheets
- **Supabase Dashboard** → Live IoT sensor data

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| **ESP-NOW not receiving** | Channel mismatch | Verify `RADIO_CHANNEL` identical on all 3 devices |
| **ESP-NOW not receiving** | Wrong Tower MAC | Get MAC from Tower Serial Monitor; update Nodes |
| **Camera init fails** | PSRAM not enabled | Tools → PSRAM: "Enabled"; Partition: "Huge APP" |
| **Camera init fails** | Wrong pin config | Verify pin definitions match your board variant |
| **Supabase upload fails** | WiFi credentials | Check `WIFI_SSID`/`WIFI_PASS`; test with phone hotspot |
| **Supabase upload fails** | 401/403 error | Verify anon key; check table permissions (anon insert) |
| **Supabase upload fails** | 404 error | Check table name `cap_counts` matches exactly |
| **TFT/OLED blank** | Wrong pins | Verify pin definitions; try I2C scanner for OLED |
| **SD card not mounting** | Format/voltage | Format FAT32; ensure 3.3V logic level; try different card |
| **Access gate false triggers** | Lighting | Increase `SKIN_TRIGGER_PCT`; adjust camera angle |
| **Access gate never triggers** | Camera issue | Check `initCamera()` returns true; verify lens clean |

---

## Performance & Limits

| Metric | Value | Notes |
|--------|-------|-------|
| **ESP-NOW Range** | 200-500m line-of-sight | Less through walls; use Channel 1/6/11 |
| **Max Nodes** | 20 (ESP-NOW limit) | Current: 2 |
| **Message Rate** | ~100/sec theoretical | Actual: ~1/sec per node (debounced) |
| **SD Card Logging** | ~1MB/day | 8 bytes/event + CSV overhead |
| **Supabase Upload** | ~1/sec batched | `pumpUploads()` runs every 1.5s |
| **Dashboard Refresh** | 15s polling + Realtime | Realtime = instant; polling = backup |
| **Access Gate** | ~500ms typical | 5 frames × 150ms + processing |

---

## Security Considerations

1. **Supabase Anon Key** — Safe to embed in client (dashboard, Tower firmware). Row Level Security (RLS) should restrict insert to `cap_counts` only.

2. **WiFi Credentials** — Stored in firmware. For production, use ESP32 NVS encrypted storage or WiFiManager captive portal.

3. **ESP-NOW** — Unencrypted. Anyone with ESP32 can sniff. For sensitive deployments, enable `p.encrypt = true` with PMK/LMK keys.

4. **Physical Access** — Radio Tower has camera-based access gate. Logs stored on SD: `/access.log`

---

## Extending the System

### Add More Nodes
1. Flash `node2_cap_counter.ino` with new `NODE_ID` (3, 4, 5...)
2. Update `TOWER_MAC` to match your Tower
3. Add node to dashboard: copy Node 1/2 chart datasets

### Add Temperature/Humidity
1. Add BME280/AHT20 to Node (I2C: SDA/SCL)
2. Extend `CapMessage` struct:
   ```cpp
   int16_t temperature_c;  // ×100 for 0.01°C resolution
   uint16_t humidity_pct;  // ×100 for 0.01%
   ```
3. Update Supabase table and dashboard

### Add Solar Power
- Node: 5V solar panel + TP4056 charger + 18650 Li-ion
- Tower: Larger panel (5W+) + LiFePO4 battery for overnight

### Add LoRa Backup
- For >500m range, add SX1276 LoRa module to Tower + Nodes
- Use as fallback when ESP-NOW fails

---

## License

MIT — Open source for educational use. Hardware designs in `cad/` are CC-BY-SA 4.0.

---

## Related Files in Kit

| File | Purpose |
|------|---------|
| `29_IOT_AND_LIVE_TRACKING.md` | IoT deployment guide, sensor setup |
| `resources/sensor_count.ino` | Original Arduino sensor code (WiFi→Sheets) |
| `16_WEBSITE_AND_DASHBOARD_DEPLOYMENT.md` | Dashboard deployment options |
| `03_COMMAND_CENTER_SHEETS.md` | Spreadsheet structure (Tab 8: Sensor Data Log) |
| `14_ASSET_CAD_AND_TOOLS_INDEX.md` | Enclosure 3D models for nodes/tower |
| `web/supabase_dashboard/` | Live Supabase-powered dashboard |
| `firmware/` | This directory — all ESP32 firmware |
