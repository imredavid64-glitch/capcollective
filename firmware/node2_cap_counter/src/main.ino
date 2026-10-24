/* ============================================================
   NODE 2 — CAP COUNTER (basic ESP32, IR beam-break)
   Counts caps via IR beam-break and sends running totals
   to the Radio Tower over ESP-NOW.
   ============================================================ */
#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>

// Channel/credentials live in `secrets.h` (GITIGNORED).
//   cp secrets.h.example secrets.h
#include "secrets.h"

// ---- CONFIG ----
#define RADIO_CHANNEL   SECRET_RADIO_CHANNEL
static uint8_t TOWER_MAC[6] = {0x14,0xC1,0x9F,0x29,0xFD,0xA4}; // replace with your tower MAC

#define NODE_ID        2
#define IR_PIN         27
#define DEBOUNCE_MS    120
#define SEND_INTERVAL  5000

typedef struct __attribute__((packed)) {
  uint8_t  node_id;
  uint16_t cap_count;
  uint8_t  color_idx;
  uint32_t timestamp_ms;
} CapMessage;

volatile unsigned long capCount = 0;
unsigned long lastTrigger = 0;
unsigned long lastSend = 0;

void IRAM_ATTR onBeamBreak() {
  unsigned long now = millis();
  if (now - lastTrigger > DEBOUNCE_MS) {
    capCount++;
    lastTrigger = now;
  }
}

void onDataSent(const wifi_tx_info_t *info, esp_now_send_status_t status) {
  // optional: log send status
  (void)info;
  (void)status;
}

void setup() {
  Serial.begin(115200);
  pinMode(IR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(IR_PIN), onBeamBreak, FALLING);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_channel(RADIO_CHANNEL, WIFI_SECOND_CHAN_NONE);

  if (esp_now_init() != ESP_OK) {
    Serial.println("ESP-NOW init failed");
    return;
  }
  esp_now_register_send_cb(onDataSent);

  esp_now_peer_info_t peer = {};
  memcpy(peer.peer_addr, TOWER_MAC, 6);
  peer.channel = RADIO_CHANNEL;
  peer.encrypt = false;
  esp_now_add_peer(&peer);

  Serial.println("Node 2 ready");
}

void loop() {
  unsigned long now = millis();
  if (now - lastSend >= SEND_INTERVAL) {
    lastSend = now;
    CapMessage msg;
    msg.node_id = NODE_ID;
    msg.cap_count = (uint16_t)capCount;
    msg.color_idx = 4; // unknown
    msg.timestamp_ms = now;
    esp_now_send(TOWER_MAC, (uint8_t *)&msg, sizeof(msg));
    Serial.printf("Sent count=%lu\n", capCount);
  }
  delay(50);
}