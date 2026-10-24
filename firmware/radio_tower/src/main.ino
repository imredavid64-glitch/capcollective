/* ============================================================
   RADIO TOWER — Central Hub
   ESP-NOW receive → TFT + OLED display + SD log + Supabase upload
   Auto-scrolling TFT. Camera-based access gate (face or hand).
   ============================================================ */
#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>
#include "esp_camera.h"
#include <SPI.h>
#include <SD_MMC.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <Adafruit_SSD1306.h>
#include <HTTPClient.h>

// ─── CONFIG ──────────────────────────────────────────────────
// Credentials live in `secrets.h`, which is GITIGNORED.
//   cp secrets.h.example secrets.h   then edit it.
// Do not commit real credentials to this file.
#include "secrets.h"
static const char* WIFI_SSID = SECRET_WIFI_SSID;
static const char* WIFI_PASS = SECRET_WIFI_PASS;
static const char* SB_URL    = SECRET_SB_URL;
static const char* SB_ANON   = SECRET_SB_ANON;

// Optional compile-time override, e.g. from platformio.ini build_flags.
#ifndef SUPABASE_UPLOAD_ENABLED
#define SUPABASE_UPLOAD_ENABLED 1
#endif

// ─── PIN MAP ─────────────────────────────────────────────────
#define TFT_SCK   21
#define TFT_MOSI  14
#define TFT_CS    47
#define TFT_DC    41
#define TFT_RST   -1

#define OLED_SDA   1
#define OLED_SCL   2

#define PWDN_GPIO_NUM  -1
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM  15
#define SIOD_GPIO_NUM   4
#define SIOC_GPIO_NUM   5
#define Y9_GPIO_NUM    16
#define Y8_GPIO_NUM    17
#define Y7_GPIO_NUM    18
#define Y6_GPIO_NUM    12
#define Y5_GPIO_NUM    10
#define Y4_GPIO_NUM     8
#define Y3_GPIO_NUM     9
#define Y2_GPIO_NUM    11
#define VSYNC_GPIO_NUM  6
#define HREF_GPIO_NUM   7
#define PCLK_GPIO_NUM  13

#define TFT_W  160
#define TFT_H  128
#define OLED_W 128
#define OLED_H  64

// ─── TIMING ──────────────────────────────────────────────────
#define VIEW_INTERVAL_MS    8000UL
#define ACCESS_TIMEOUT_MS  60000UL

#define SKIN_TRIGGER_PCT     8
#define SKIN_HOLD_FRAMES     5
#define SKIN_SCAN_INTERVAL  150

// ─── EVENT BUFFER ────────────────────────────────────────────
#define MAX_EVENTS 100

typedef struct __attribute__((packed)) {
  uint8_t  node_id;
  uint16_t cap_count;
  uint8_t  color_idx;
  uint32_t timestamp_ms;
} CapMessage;

struct Event {
  uint8_t  node_id;
  uint16_t cap_count;
  uint8_t  color_idx;
  uint32_t millis_at_rx;
  bool     uploaded;
};

static const char* COLOR_NAMES[] = {"red","blue","green","white","unknown"};
static Event event_buf[MAX_EVENTS];
static int event_head = 0;
static int event_count = 0;
static int upload_cursor = 0;

static uint16_t total_by_node[3] = {0,0,0};
static uint32_t color_counts[5]  = {0,0,0,0,0};
static unsigned long last_rx_ms[3] = {0,0,0};

static Adafruit_ST7735  tft(TFT_CS, TFT_DC, TFT_RST);
static Adafruit_SSD1306 oled(OLED_W, OLED_H, &Wire, -1);

static uint8_t  tft_view       = 0;
static uint8_t  drawn_view     = 255;
static bool     stats_dirty    = true;
static bool     log_dirty      = true;
static bool     system_dirty   = true;
static unsigned long last_view_switch = 0;

// ============================================================
//  CAMERA
// ============================================================
bool initCamera() {
  camera_config_t c = {};
  c.ledc_channel = LEDC_CHANNEL_0; c.ledc_timer = LEDC_TIMER_0;
  c.pin_d0 = Y2_GPIO_NUM; c.pin_d1 = Y3_GPIO_NUM;
  c.pin_d2 = Y4_GPIO_NUM; c.pin_d3 = Y5_GPIO_NUM;
  c.pin_d4 = Y6_GPIO_NUM; c.pin_d5 = Y7_GPIO_NUM;
  c.pin_d6 = Y8_GPIO_NUM; c.pin_d7 = Y9_GPIO_NUM;
  c.pin_xclk = XCLK_GPIO_NUM; c.pin_pclk = PCLK_GPIO_NUM;
  c.pin_vsync = VSYNC_GPIO_NUM; c.pin_href = HREF_GPIO_NUM;
  c.pin_sccb_sda = SIOD_GPIO_NUM; c.pin_sccb_scl = SIOC_GPIO_NUM;
  c.pin_pwdn = PWDN_GPIO_NUM; c.pin_reset = RESET_GPIO_NUM;
  c.xclk_freq_hz = 20000000;
  c.pixel_format = PIXFORMAT_RGB565;
  c.frame_size = FRAMESIZE_QVGA;
  c.jpeg_quality = 12; c.fb_count = 1;
  c.fb_location = CAMERA_FB_IN_PSRAM;
  c.grab_mode = CAMERA_GRAB_LATEST;
  return esp_camera_init(&c) == ESP_OK;
}

int skinPixelPercent() {
  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb || fb->format != PIXFORMAT_RGB565) {
    if (fb) esp_camera_fb_return(fb);
    return -1;
  }

  const int w = fb->width, h = fb->height;
  int skin = 0, total = 0;

  const int x0 = w * 2 / 10;
  const int x1 = w * 8 / 10;
  const int y0 = h * 1 / 10;
  const int y1 = h * 9 / 10;

  for (int y = y0; y < y1; y += 3) {
    for (int x = x0; x < x1; x += 3) {
      int i = (y * w + x) * 2;
      uint16_t px = (fb->buf[i] << 8) | (fb->buf[i + 1]);
      int r = ((px >> 11) & 0x1F) << 3;
      int g = ((px >> 5)  & 0x3F) << 2;
      int b =  (px        & 0x1F) << 3;
      total++;

      bool is_skin = (r > 60 && g > 30 && b > 15 &&
                      r > g && r > b &&
                      (r - g) > 8 && (r - b) > 12 &&
                      abs(g - b) < 80);
      if (is_skin) skin++;
    }
  }

  esp_camera_fb_return(fb);
  return total > 0 ? (skin * 100 / total) : 0;
}

void showAccessScreen(const char* line1, const char* line2,
                      uint16_t color1, uint16_t color2) {
  tft.fillScreen(ST77XX_BLACK);

  tft.setTextColor(ST77XX_WHITE);
  tft.setTextSize(2);
  tft.setCursor(6, 6);
  tft.println("RADIO TOWER");

  tft.drawFastHLine(0, 30, TFT_W, ST77XX_WHITE);

  tft.setTextSize(1);
  tft.setTextColor(color1);
  tft.setCursor(6, 42);
  tft.println(line1);

  tft.setTextColor(color2);
  tft.setCursor(6, 58);
  tft.println(line2);
}

void waitForAccess() {
  Serial.println("\n========== ACCESS GATE ==========");

  if (!initCamera()) {
    Serial.println("[ACCESS] Camera init failed — granting access");
    showAccessScreen("Camera failed", "Bypassing...",
                     ST77XX_RED, ST77XX_RED);
    oled.clearDisplay(); oled.setCursor(0, 0);
    oled.println("CAMERA FAIL"); oled.println("Bypassing");
    oled.display();
    delay(2000);
    return;
  }
  Serial.println("[ACCESS] Camera ready.");

  showAccessScreen("Place your FACE or HAND",
                   "in front of the camera",
                   ST77XX_YELLOW, ST77XX_WHITE);

  oled.clearDisplay(); oled.setTextSize(1);
  oled.setCursor(0, 0);
  oled.println("== ACCESS GATE ==");
  oled.println("Place your FACE");
  oled.println("or HAND in front");
  oled.println("of the camera");
  oled.println();
  oled.println("Status: waiting...");
  oled.display();

  unsigned long start = millis();
  unsigned long last_oled_update = 0;
  int consecutive_hits = 0;
  int best_pct = 0;
  int frame_pct = 0;
  int last_drawn_pct = -1;
  const int pct_y = 84;

  while (true) {
    frame_pct = skinPixelPercent();

    if (frame_pct != last_drawn_pct) {
      last_drawn_pct = frame_pct;
      tft.fillRect(6, pct_y, TFT_W - 12, 16, ST77XX_BLACK);
      tft.setTextSize(2);
      tft.setCursor(6, pct_y);
      if (frame_pct < 0) {
        tft.setTextColor(ST77XX_RED);
        tft.print("Capture err");
      } else if (frame_pct >= SKIN_TRIGGER_PCT) {
        tft.setTextColor(ST77XX_GREEN);
        tft.printf("Detected: %d%%", frame_pct);
      } else {
        tft.setTextColor(ST77XX_YELLOW);
        tft.printf("Detect:   %d%%", frame_pct);
      }
    }

    if (millis() - last_oled_update > 250) {
      last_oled_update = millis();
      oled.clearDisplay();
      oled.setCursor(0, 0);
      oled.println("== ACCESS GATE ==");
      oled.println("Face / hand check");
      oled.println();
      oled.printf("Skin: %d%%\n", frame_pct);
      if (consecutive_hits > 0) {
        oled.printf("Hold: %d/%d\n", consecutive_hits, SKIN_HOLD_FRAMES);
      } else {
        oled.println("Waiting...");
      }
      oled.display();
    }

    if (frame_pct >= SKIN_TRIGGER_PCT) {
      consecutive_hits++;
      if (frame_pct > best_pct) best_pct = frame_pct;

      if (consecutive_hits == 1) {
        Serial.printf("[ACCESS] Object detected (%d%%) — confirming...\n", frame_pct);
      }
      if (consecutive_hits >= SKIN_HOLD_FRAMES) {
        Serial.printf("[ACCESS] CONFIRMED at %d%% — GRANTED\n", frame_pct);
        break;
      }
    } else {
      if (consecutive_hits > 0) {
        Serial.println("[ACCESS] Lost — resetting");
      }
      consecutive_hits = 0;
    }

    if (millis() - start > ACCESS_TIMEOUT_MS) {
      Serial.println("[ACCESS] Timeout — auto-granting");
      break;
    }

    delay(SKIN_SCAN_INTERVAL);
  }

  tft.fillScreen(ST77XX_BLACK);
  tft.setTextColor(ST77XX_GREEN);
  tft.setTextSize(2);
  tft.setCursor(6, 30);
  tft.println("  ACCESS");
  tft.setCursor(6, 55);
  tft.println("  GRANTED");

  tft.setTextSize(1);
  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(6, 90);
  tft.printf("Confidence: %d%%", best_pct);
  tft.setCursor(6, 104);
  tft.printf("Uptime: %lus", millis() / 1000);

  oled.clearDisplay();
  oled.setCursor(0, 0);
  oled.println("== GRANTED ==");
  oled.println("Face/hand OK");
  oled.printf("Conf: %d%%\n", best_pct);
  oled.display();

  File f = SD_MMC.open("/access.log", FILE_APPEND);
  if (f) {
    f.printf("%lu GRANTED conf=%d%%\n", millis(), best_pct);
    f.close();
  }
  delay(1500);
}

// ============================================================
//  DISPLAYS
// ============================================================
void drawStatsView() {
  tft.fillScreen(ST77XX_BLACK);
  tft.setTextColor(ST77XX_CYAN); tft.setTextSize(1);
  tft.setCursor(4, 4);   tft.print("LIVE STATS");
  tft.setCursor(120, 4); tft.print("1/3");

  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(6, 22);  tft.print("Node 1");
  tft.setCursor(6, 70);  tft.print("Node 2");

  tft.setTextSize(3);
  tft.setTextColor(ST77XX_GREEN);
  tft.setCursor(6, 34);  tft.printf("%5u", total_by_node[1]);
  tft.setCursor(6, 82);  tft.printf("%5u", total_by_node[2]);

  tft.setTextSize(1); tft.setTextColor(ST77XX_YELLOW);
  tft.setCursor(96, 22); tft.print("Colors:");
  const uint16_t hues[5] = {ST77XX_RED, ST77XX_BLUE, ST77XX_GREEN,
                            ST77XX_WHITE, ST77XX_MAGENTA};
  for (int i = 0; i < 5; i++) {
    tft.setTextColor(hues[i]);
    tft.setCursor(96, 36 + i * 10);
    tft.printf("%-7s %lu", COLOR_NAMES[i], (unsigned long)color_counts[i]);
  }

  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(4, 116);
  unsigned long now = millis();
  tft.printf("N1:%lus N2:%lus",
             (now - last_rx_ms[1]) / 1000,
             (now - last_rx_ms[2]) / 1000);
}

void drawLogView() {
  tft.fillScreen(ST77XX_BLACK);
  tft.setTextColor(ST77XX_CYAN); tft.setTextSize(1);
  tft.setCursor(4, 4);   tft.print("EVENT LOG");
  tft.setCursor(120, 4); tft.print("2/3");

  int shown = 0;
  for (int i = 0; i < MAX_EVENTS && shown < 9; i++) {
    int idx = (event_head - 1 - i + MAX_EVENTS*2) % MAX_EVENTS;
    if (i >= event_count) break;
    Event& e = event_buf[idx];
    const uint16_t hues[5] = {ST77XX_RED, ST77XX_BLUE, ST77XX_GREEN,
                              ST77XX_WHITE, ST77XX_MAGENTA};
    tft.setTextColor(hues[e.color_idx]);
    tft.setCursor(4, 18 + shown * 12);
    tft.printf("N%d #%-5u %-7s %lus",
               e.node_id, e.cap_count, COLOR_NAMES[e.color_idx],
               e.millis_at_rx / 1000);
    shown++;
  }
  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(4, 116);
  tft.printf("Total events: %d", event_count);
}

void drawSystemView() {
  tft.fillScreen(ST77XX_BLACK);
  tft.setTextColor(ST77XX_CYAN); tft.setTextSize(1);
  tft.setCursor(4, 4);   tft.print("SYSTEM");
  tft.setCursor(120, 4); tft.print("3/3");

  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(4, 20);  tft.printf("WiFi:  %s", WiFi.isConnected() ? "UP" : "DOWN");
  tft.setCursor(4, 32);  tft.printf("IP:    %s", WiFi.localIP().toString().c_str());
  tft.setCursor(4, 44);  tft.printf("RSSI:  %d dBm", WiFi.RSSI());
  tft.setCursor(4, 56);  tft.printf("Chan:  %d", WiFi.channel());
  tft.setCursor(4, 68);  tft.printf("Uptime:%lus", millis() / 1000);
  tft.setCursor(4, 80);  tft.printf("Events:%d", event_count);
  tft.setCursor(4, 92);  tft.printf("Uploaded:%d", upload_cursor);

  if (SD_MMC.cardType() != CARD_NONE) {
    uint64_t used = SD_MMC.usedBytes(), total = SD_MMC.totalBytes();
    tft.setCursor(4, 104);
    tft.printf("SD:    %.1f/%.1f MB", used / 1048576.0, total / 1048576.0);
  } else {
    tft.setTextColor(ST77XX_RED);
    tft.setCursor(4, 104); tft.print("SD: no card");
  }
}

void updateTFT() {
  if (drawn_view == tft_view) {
    if (tft_view == 0 && !stats_dirty)  return;
    if (tft_view == 1 && !log_dirty)    return;
    if (tft_view == 2 && !system_dirty) return;
  }
  switch (tft_view) {
    case 0: drawStatsView();  stats_dirty  = false; break;
    case 1: drawLogView();    log_dirty    = false; break;
    case 2: drawSystemView(); system_dirty = false; break;
  }
  drawn_view = tft_view;
}

void updateOLED() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(0, 0);
  oled.printf("RADIO TOWER  %s\n", WiFi.isConnected() ? "WIFI" : "----");
  oled.printf("N1:%u N2:%u\n", total_by_node[1], total_by_node[2]);
  oled.printf("Total:%u\n", total_by_node[1] + total_by_node[2]);
  if (event_count > 0) {
    Event& e = event_buf[(event_head - 1 + MAX_EVENTS) % MAX_EVENTS];
    oled.printf("Last: N%d %s #%u\n",
                e.node_id, COLOR_NAMES[e.color_idx], e.cap_count);
  } else {
    oled.println("Waiting for data...");
  }
  oled.printf("Up:%lus SD:%s", millis() / 1000,
              SD_MMC.cardType() == CARD_NONE ? "no" : "ok");
  oled.display();
}

// ============================================================
//  SD LOGGING
// ============================================================
void logEventToSD(const Event& e) {
  if (SD_MMC.cardType() == CARD_NONE) return;
  File f = SD_MMC.open("/cap_log.csv", FILE_APPEND);
  if (!f) return;
  if (f.size() == 0) f.println("uptime_ms,node_id,cap_count,color");
  f.printf("%lu,%u,%u,%s\n",
           (unsigned long)e.millis_at_rx, e.node_id, e.cap_count,
           COLOR_NAMES[e.color_idx]);
  f.close();
}

// ============================================================
//  ESP-NOW RECEIVE
// ============================================================
void onRecv(const esp_now_recv_info_t*, const uint8_t* data, int len) {
  if (len != sizeof(CapMessage)) {
    Serial.printf("[RX] bad len %d\n", len); return;
  }
  CapMessage m;
  memcpy(&m, data, sizeof(m));

  Event e;
  e.node_id      = m.node_id;
  e.cap_count    = m.cap_count;
  e.color_idx    = m.color_idx;
  e.millis_at_rx = millis();
  e.uploaded     = false;

  event_buf[event_head] = e;
  event_head = (event_head + 1) % MAX_EVENTS;
  event_count++;
  total_by_node[m.node_id] = m.cap_count;
  if (m.color_idx < 5) color_counts[m.color_idx]++;
  last_rx_ms[m.node_id] = millis();

  Serial.printf("[RX] Node %u  #%u  %s\n",
                m.node_id, m.cap_count, COLOR_NAMES[m.color_idx]);

  logEventToSD(e);

  stats_dirty = true;
  log_dirty   = true;
  updateTFT();
  updateOLED();
}

// ============================================================
//  WIFI + SUPABASE (PostgREST over plain HTTPClient)
// ============================================================
void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("WiFi");
  unsigned long s = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - s < 15000) {
    Serial.print("."); delay(400);
  }
  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("WiFi OK  IP=%s  ch=%d\n",
                  WiFi.localIP().toString().c_str(), WiFi.channel());
    esp_wifi_set_ps(WIFI_PS_NONE);
  }
}

void pumpUploads() {
  if (WiFi.status() != WL_CONNECTED) return;
  if (upload_cursor >= event_count) return;

  int idx = (event_head - (event_count - upload_cursor) + MAX_EVENTS*2) % MAX_EVENTS;
  Event& e = event_buf[idx];
  if (e.uploaded) { upload_cursor++; return; }

  String json = "{";
  json += "\"node_id\":"   + String(e.node_id)                    + ",";
  json += "\"cap_count\":" + String(e.cap_count)                  + ",";
  json += "\"cap_color\":\"" + String(COLOR_NAMES[e.color_idx]) + "\"}";

  int code = 0;
#if SUPABASE_UPLOAD_ENABLED
  // PostgREST insert: POST {url}/rest/v1/cap_counts
  // Needs the anon key plus Prefer: return=minimal.
  HTTPClient http;
  String endpoint = String(SB_URL) + "/rest/v1/cap_counts";
  http.begin(endpoint);
  http.setTimeout(10000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", SB_ANON);
  http.addHeader("Authorization", String("Bearer ") + SB_ANON);
  http.addHeader("Prefer", "return=minimal");
  code = http.POST(json);
  http.end();
#else
  // Upload disabled (no Supabase project configured): log locally only.
  code = 204;
#endif

  if (code >= 200 && code < 300) {
    e.uploaded = true;
    upload_cursor++;
    Serial.printf("[SB] OK  %s\n", json.c_str());
  } else {
    Serial.printf("[SB] ERR %d  %s\n", code, json.c_str());
  }
}

// ============================================================
//  SETUP / LOOP
// ============================================================
void setup() {
  Serial.begin(115200); delay(500);
  Serial.println("\n=== RADIO TOWER ===");

#if defined(RGB_BUILTIN)
  pinMode(RGB_BUILTIN, OUTPUT);
  digitalWrite(RGB_BUILTIN, LOW);
#endif

  Wire.begin(OLED_SDA, OLED_SCL);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.clearDisplay(); oled.setTextSize(1); oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(0,0); oled.println("Booting..."); oled.display();

  SPI.begin(TFT_SCK, -1, TFT_MOSI, TFT_CS);
  tft.initR(INITR_BLACKTAB);
  tft.setRotation(1);
  tft.fillScreen(ST77XX_BLACK);

  SD_MMC.setPins(39, 38, 40);
  if (SD_MMC.begin("/sdcard", true)) {
    Serial.printf("SD OK  %llu MB total\n",
                  SD_MMC.totalBytes() / (1024ULL * 1024ULL));
  } else {
    Serial.println("SD FAIL (tower will run without SD logging)");
  }

  connectWiFi();
  Serial.printf("\n>> Tower MAC: %s\n", WiFi.macAddress().c_str());
  Serial.printf(">> Tower CH:  %d   <-- put this in RADIO_CHANNEL on both counters\n\n",
                WiFi.channel());

  int ch = WiFi.channel();
  esp_err_t err = esp_wifi_set_channel(ch, WIFI_SECOND_CHAN_NONE);
  if (err == ESP_OK) Serial.printf("Tower radio locked to channel %d\n", ch);

  if (esp_now_init() == ESP_OK) {
    esp_now_register_recv_cb(onRecv);
    esp_wifi_set_ps(WIFI_PS_NONE);
    Serial.println("ESP-NOW receiver ready");
  } else {
    Serial.println("ESP-NOW FAIL");
  }

  waitForAccess();

  drawn_view = 255;
  updateTFT();
  updateOLED();

  last_view_switch = millis();
}

void loop() {
  if (millis() - last_view_switch > VIEW_INTERVAL_MS) {
    last_view_switch = millis();
    tft_view = (tft_view + 1) % 3;
    updateTFT();
    updateOLED();
  }

  static unsigned long last_upload = 0;
  if (millis() - last_upload > 1500) {
    last_upload = millis();
    pumpUploads();
  }

  if (WiFi.status() != WL_CONNECTED) {
    static unsigned long last_retry = 0;
    if (millis() - last_retry > 10000) {
      last_retry = millis();
      connectWiFi();
    }
  }

  delay(50);
}