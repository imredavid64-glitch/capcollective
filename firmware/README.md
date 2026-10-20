# Cap Collective — Firmware & IoT System

Complete ESP32/ESP32-S3 firmware for the Cap Collective IoT bottle cap counting system.

## Architecture Overview

```
┌─────────────────┐     ESP-NOW      ┌─────────────────┐     WiFi/Supabase    ┌──────────────────┐
│   Node 1        │ ──────────────►  │   Radio Tower   │ ─────────────────►   │   Supabase       │
│   (ESP32-S3 CAM)│   2.4 GHz        │   (ESP32-S3)    │   HTTPS/REST       │   PostgreSQL     │
│   Ultrasonic +  │   Channel 1      │   TFT + OLED    │                    │   Real-time      │
│   Color Camera  │                  │   SD Card Log   │                    │   Dashboard      │
└─────────────────┘                  └─────────────────┘                    └──────────────────┘
        ▲                                                                          │
        │                                                                          ▼
        │ ESP-NOW                                              ┌──────────────────────────────┐
        └────────────────────────────────────────────────────► │   Web Dashboard (HTML/JS)    │
         (Node 2)                                              │   Chart.js + Supabase Realtime│
                                                               └──────────────────────────────┘
```

## Directory Structure

```
firmware/
├── node1_cap_counter/          # ESP32-S3 CAM + Ultrasonic + Color Detection
│   ├── node1_cap_counter.ino   # Minimal version (from deepseek_cpp_20261011_4d43bc.cpp)
│   └── node1_full.ino          # Full version with camera + TFLite (from deepseek_cpp_20261011_f5da65.cpp)
├── node2_cap_counter/          # Simpler ESP32 cap counter
│   ├── node2_cap_counter.ino   # Main firmware (from deepseek_cpp_20261011_9cd370.cpp)
│   └── node2_config.h          # Configuration (from deepseek_cpp_20261011_945e28.cpp)
├── radio_tower/                # Central hub receiver
│   └── radio_tower.ino         # Full hub firmware (from deepseek_cpp_20261011_dae55a.cpp)
└── libraries/                  # Required Arduino libraries (see below)
```

## Hardware Requirements

### Node 1 — Cap Counter with Camera (ESP32-S3 CAM)
| Component | Pin / Spec |
|-----------|------------|
| **MCU** | Freenove ESP32-S3 CAM (or any ESP32-S3 with camera) |
| **Ultrasonic** | HC-SR04: TRIG=GPIO 2, ECHO=GPIO 1 |
| **Camera** | OV2640/QVGA/RGB565 (built-in on Freenove) |
| **Radio** | ESP-NOW on WiFi Channel 1 |
| **Power** | 5V USB or 3.7V LiPo + regulator |

### Node 2 — Basic Cap Counter (ESP32)
| Component | Pin / Spec |
|-----------|------------|
| **MCU** | ESP32 DevKit V1 / ESP32-S3 |
| **Sensor** | IR Beam-break (FC-51) or Ultrasonic |
| **Radio** | ESP-NOW on WiFi Channel 1 |

### Radio Tower — Central Hub (ESP32-S3)
| Component | Pin / Spec |
|-----------|------------|
| **MCU** | ESP32-S3 (with PSRAM) |
| **TFT Display** | ST7735 160×128: SCK=21, MOSI=14, CS=47, DC=41, RST=-1 |
| **OLED Display** | SSD1306 128×64: SDA=1, SCL=2 |
| **SD Card** | SD_MMC: CLK=39, CMD=38, D0=40 |
| **Camera** | OV2640 (for access gate face/hand detection) |
| **Radio** | ESP-NOW receive on same channel as nodes |
| **WiFi** | Connects to local network for Supabase upload |

## Required Arduino Libraries

Install via Library Manager:

```
ESP-NOW (built-in)
WiFi (built-in)
esp_camera (built-in for ESP32)
Adafruit GFX Library
Adafruit ST7735 and ST7789 Library
Adafruit SSD1306
SD_MMC (built-in for ESP32)
ESPSupabase (search "ESPSupabase" in the Arduino Library Manager; or use HTTPClient + ArduinoJson against the REST endpoint documented in cap-collective-dashboard/supabase_schema.sql)
ArduinoJson (for JSON handling)
TensorFlowLite_ESP32 (optional, for TFLite model on Node 1)
```

## Configuration

### 1. Set Radio Channel (must match on all devices)
```cpp
#define RADIO_CHANNEL   1  // Change if interference
```

### 2. Set Tower MAC Address on Nodes
```cpp
// In node1_cap_counter.ino / node2_cap_counter.ino
static uint8_t TOWER_MAC[6] = {0x14,0xC1,0x9F,0x29,0xFD,0xA4};  // Replace with your Tower's MAC
```

Get Tower MAC from Serial Monitor on boot: `>> Tower MAC: 14:C1:9F:29:FD:A4`

### 3. Configure WiFi & Supabase (Radio Tower only)
```cpp
// In radio_tower.ino
static const char* WIFI_SSID = "YourWiFiSSID";
static const char* WIFI_PASS = "YourWiFiPassword";
static const char* SB_URL    = "https://your-project.supabase.co";
static const char* SB_ANON   = "your-anon-key";
```

### 4. Create Supabase Table
```sql
create table cap_counts (
  id bigserial primary key,
  created_at timestamp with time zone default now(),
  node_id smallint not null,
  cap_count integer not null,
  cap_color text not null
);

-- Enable realtime
alter publication supabase_realtime add table cap_counts;
```

## Data Protocol (ESP-NOW)

```cpp
// Packed struct sent from Nodes → Tower
typedef struct __attribute__((packed)) {
  uint8_t  node_id;      // 1 or 2
  uint16_t cap_count;    // Running total from this node
  uint8_t  color_idx;    // 0=red, 1=blue, 2=green, 3=white, 4=unknown
  uint32_t timestamp_ms; // Millis since boot
} CapMessage;
```

## Supabase Schema (cap_counts table)

| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| created_at | timestamptz | Auto-set on insert |
| node_id | smallint | 1 or 2 |
| cap_count | integer | Running total from node |
| cap_color | text | 'red', 'blue', 'green', 'white', 'unknown' |

## Flashing Instructions

### PlatformIO (Recommended)
```bash
# Node 1
cd firmware/node1_cap_counter
pio run -t upload

# Node 2
cd firmware/node2_cap_counter
pio run -t upload

# Radio Tower
cd firmware/radio_tower
pio run -t upload
```

### Arduino IDE
1. Install ESP32 board package: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
2. Select board: "ESP32S3 Dev Module" (or your specific board)
3. Set partition scheme: "Huge APP (3MB No OTA/1MB SPIFFS)" for camera
4. Upload each sketch

## Web Dashboard

The HTML dashboard at `web/supabase_dashboard/index.html` provides:
- Real-time total caps per node
- 24-hour hourly trend chart (Chart.js)
- Color distribution pie chart
- Node health status (online/offline)
- Recent events table with color dots
- Supabase Realtime subscriptions for instant updates

### Deploy Dashboard
```bash
# Option 1: Static hosting (Netlify, Vercel, GitHub Pages)
# Just upload web/supabase_dashboard/ folder

# Option 2: Supabase Hosting
supabase functions deploy dashboard --no-verify-jwt
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| ESP-NOW not receiving | Verify same `RADIO_CHANNEL` on all devices; check Tower MAC |
| Camera init fails | Ensure PSRAM enabled; check pin definitions match board |
| Supabase upload fails | Check WiFi credentials; verify anon key; check table permissions |
| TFT/OLED not showing | Verify SPI/I2C pins; check display driver initialization |
| SD card not mounting | Check SD_MMC pins; format as FAT32; try different card |

## License

MIT — Open source for educational use.

## Related Documentation

- Main Kit: `../README.md`
- IoT Deployment Guide: `../29_IOT_AND_LIVE_TRACKING.md`
- Sensor Code (Arduino): `../resources/sensor_count.ino`
- Dashboard Deployment: `../16_WEBSITE_AND_DASHBOARD_DEPLOYMENT.md`
