/*
 * Cap Collective — Bottle Cap Counter
 * ESP32 + IR Beam-Break Sensor
 * Counts caps passing through a chute and POSTs to Google Sheets (via Apps Script webhook)
 *
 * Hardware:
 *   - ESP32 dev board
 *   - IR beam-break sensor (e.g., FC-51 or a raw IR LED + photodiode pair)
 *   - Optional: 16x2 I2C LCD
 *
 * Wiring:
 *   IR Sensor VCC -> ESP32 3V3
 *   IR Sensor GND -> ESP32 GND
 *   IR Sensor OUT -> ESP32 GPIO 27
 *   LCD SDA -> GPIO 21, LCD SCL -> GPIO 22 (if used)
 *
 * Libraries: WiFi.h, HTTPClient.h, ArduinoJson.h, Wire.h, LiquidCrystal_I2C.h (optional)
 */

#include <WiFi.h>
#include <HTTPClient.h>

// ---------- CONFIG ----------
const char* WIFI_SSID     = "YOUR_WIFI";
const char* WIFI_PASSWORD = "YOUR_PASSWORD";

// Google Apps Script Web App URL (see Command Center setup)
const char* WEBHOOK_URL = "https://script.google.com/macros/s/XXXXX/exec";

const char* BIN_ID = "CAFE-01";       // unique per box
const int   IR_PIN = 27;              // beam-break sensor output

// ---------- STATE ----------
volatile unsigned long capCount = 0;
unsigned long lastTrigger = 0;
const unsigned long DEBOUNCE_MS = 120;   // ignore bounces within this window
unsigned long lastReport = 0;
const unsigned long REPORT_INTERVAL = 60000UL; // send every 60s

void IRAM_ATTR onBeamBreak() {
  unsigned long now = millis();
  if (now - lastTrigger > DEBOUNCE_MS) {
    capCount++;
    lastTrigger = now;
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(IR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(IR_PIN), onBeamBreak, FALLING);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected. IP: " + WiFi.localIP().toString());
}

void postCount() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(WEBHOOK_URL);
  http.addHeader("Content-Type", "application/json");

  // Simple JSON payload (no ArduinoJson dependency required)
  String payload = String("{\"binId\":\"") + BIN_ID +
                   "\",\"count\":" + String(capCount) +
                   ",\"fill\":" + String(min(100UL, (capCount * 100) / 2000)) +
                   ",\"temp\":22}";

  int code = http.POST(payload);
  Serial.printf("POST -> %d | payload: %s\n", code, payload.c_str());
  http.end();
}

void loop() {
  unsigned long now = millis();

  if (now - lastReport >= REPORT_INTERVAL) {
    lastReport = now;
    postCount();
    Serial.printf("Total caps: %lu\n", capCount);
  }

  // Optional: reset daily count at midnight, etc. (add RTC/NTP for scheduling)
  delay(50);
}

/*
 * ---- GOOGLE APPS SCRIPT WEBHOOK (paste into Extensions > Apps Script) ----
 *
 * function doPost(e) {
 *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sensor Data Log");
 *   var data = JSON.parse(e.postData.contents);
 *   sheet.appendRow([
 *     new Date(),
 *     data.binId,
 *     data.count,
 *     data.fill,
 *     data.temp,
 *     "OK",
 *     "ESP32"
 *   ]);
 *   return ContentService.createTextOutput("OK");
 * }
 *
 * Deploy > New deployment > Web app > Execute as: Me > Access: Anyone
 * Copy the /exec URL into WEBHOOK_URL above.
 */
