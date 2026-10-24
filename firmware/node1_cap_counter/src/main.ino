/* ============================================================
   NODE 1 — CAP COUNTER
   Freenove ESP32-S3 CAM + HC-SR04
   Camera + ultrasonic → ESP-NOW → Radio Tower
   ============================================================ */
#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>
#include "esp_camera.h"

// Channel/credentials live in `secrets.h` (GITIGNORED).
//   cp secrets.h.example secrets.h
#include "secrets.h"

// ─── CONFIG ──────────────────────────────────────────────────
#define RADIO_CHANNEL   SECRET_RADIO_CHANNEL
static uint8_t TOWER_MAC[6] = {0x14,0xC1,0x9F,0x29,0xFD,0xA4};

#define NODE_ID        1
#define TRIG_PIN       2
#define ECHO_PIN       1
#define CAP_DETECT_CM  5.0f
#define DEBOUNCE_MS    800
#define USE_TFLITE     0
// ─────────────────────────────────────────────────────────────

#if USE_TFLITE
  #include "model.h"
  #include "tensorflow/lite/micro/micro_mutable_op_resolver.h"
  #include "tensorflow/lite/micro/micro_interpreter.h"
  #include "tensorflow/lite/schema/schema_generated.h"
  constexpr int kArenaSize = 150 * 1024;
  static uint8_t tensor_arena[kArenaSize];
  static tflite::MicroInterpreter* interp = nullptr;
#endif

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

typedef struct __attribute__((packed)) {
  uint8_t  node_id;
  uint16_t cap_count;
  uint8_t  color_idx;
  uint32_t timestamp_ms;
} CapMessage;

static const char* COLOR_NAMES[] = {"red","blue","green","white","unknown"};
static uint16_t total_count = 0;
static unsigned long last_detect_ms = 0;
static bool camera_ok = false;

float readUltrasonicCM() {
  digitalWrite(TRIG_PIN, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  unsigned long d = pulseIn(ECHO_PIN, HIGH, 30000UL);
  return d == 0 ? -1.0f : d * 0.0343f / 2.0f;
}

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
  c.frame_size = FRAMESIZE_96X96;
  c.jpeg_quality = 12;
  c.fb_count = 1;
  c.fb_location = CAMERA_FB_IN_PSRAM;
  c.grab_mode = CAMERA_GRAB_LATEST;
  return esp_camera_init(&c) == ESP_OK;
}

uint8_t classifyByColor(camera_fb_t* fb) {
  if (!fb || fb->format != PIXFORMAT_RGB565) return 4;
  const int w = fb->width, h = fb->height;
  uint32_t r=0,g=0,b=0,n=0;
  for (int y=h/4; y<3*h/4; y+=2)
    for (int x=w/4; x<3*w/4; x+=2) {
      int i = (y*w+x)*2;
      uint16_t px = (fb->buf[i]<<8)|fb->buf[i+1];
      r += (px>>11)&0x1F; g += (px>>5)&0x3F; b += px&0x1F; n++;
    }
  if (!n) return 4;
  r/=n; g/=n; b/=n;
  uint32_t mx = max(r,max(g,b)), mn = min(r,min(g,b));
  uint32_t chroma = mx-mn, bright = (r+g+b)/3;
  if (chroma<6 && bright>20) return 3;
  if (chroma<6) return 4;
  if (r==mx && r>g && r>b) return 0;
  if (b==mx && b>r && b>g) return 1;
  if (g==mx && g>r && g>b) return 2;
  return 4;
}

#if USE_TFLITE
bool initModel() {
  static tflite::MicroMutableOpResolver<5> res;
  res.AddConv2D(); res.AddDepthwiseConv2D();
  res.AddFullyConnected(); res.AddSoftmax(); res.AddReshape();
  static tflite::MicroInterpreter si(model_data, model_len, res,
                                     tensor_arena, kArenaSize);
  interp = &si;
  return interp->AllocateTensors() == kTfLiteOk;
}
uint8_t classifyWithTFLite(camera_fb_t* fb) {
  if (!fb) return 4;
  TfLiteTensor* in = interp->input(0);
  int8_t* dst = in->data.int8;
  const int w=fb->width, h=fb->height, T=96;
  for (int ty=0; ty<T; ty++) { int sy=ty*h/T;
    for (int tx=0; tx<T; tx++) { int sx=tx*w/T, i=(sy*w+sx)*2;
      uint16_t px = (fb->buf[i]<<8)|fb->buf[i+1];
      int base = (ty*T+tx)*3;
      dst[base]   = (int8_t)((((px>>11)&0x1F)<<3)-128);
      dst[base+1] = (int8_t)((((px>>5) &0x3F)<<2)-128);
      dst[base+2] = (int8_t)((( px     &0x1F)<<3)-128);
    }
  }
  if (interp->Invoke()!=kTfLiteOk) return 4;
  int8_t* out = interp->output(0)->data.int8;
  int best = 0; for (int i=1; i<4; i++) if (out[i]>out[best]) best = i;
  return (uint8_t)best;
}
#endif

void onSent(const wifi_tx_info_t*, esp_now_send_status_t s) {
  Serial.printf("[TX] %s\n", s == ESP_NOW_SEND_SUCCESS ? "OK" : "FAIL");
}

void initEspNow() {
  WiFi.mode(WIFI_STA);
  delay(200);

  esp_wifi_set_ps(WIFI_PS_NONE);
  delay(100);

  esp_err_t err = esp_wifi_set_channel(RADIO_CHANNEL, WIFI_SECOND_CHAN_NONE);
  if (err != ESP_OK) {
    Serial.printf("set_channel(%d) failed: %d\n", RADIO_CHANNEL, err);
  }

  delay(100);
  uint8_t primary_ch;
  wifi_second_chan_t second_ch;
  esp_wifi_get_channel(&primary_ch, &second_ch);
  Serial.printf("Requested channel %d, actual channel %d\n",
                RADIO_CHANNEL, primary_ch);

  if (esp_now_init() != ESP_OK) { Serial.println("ESP-NOW init FAIL"); return; }
  esp_now_register_send_cb(onSent);

  esp_now_peer_info_t p = {};
  memcpy(p.peer_addr, TOWER_MAC, 6);
  p.channel = RADIO_CHANNEL;
  p.encrypt = false;
  p.ifidx   = WIFI_IF_STA;
  Serial.println(esp_now_add_peer(&p) == ESP_OK ? "Peer OK" : "Peer FAIL");
}

void setup() {
  Serial.begin(115200); delay(500);
  Serial.println("\n=== Node 1 (Cap Counter) ===");

  if (psramFound()) Serial.printf("PSRAM: OK, %u bytes free\n", ESP.getPsramSize());
  else              Serial.println("PSRAM: NOT FOUND");

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  if (initCamera()) {
    camera_ok = true;
    Serial.println("Camera OK");
  } else {
    camera_ok = false;
    Serial.println("Camera FAIL — continuing WITHOUT color detection");
  }

  initEspNow();
  Serial.printf("Node 1 ready. Own MAC: %s\n\n", WiFi.macAddress().c_str());
}

void loop() {
  float cm = readUltrasonicCM();
  unsigned long now = millis();

  if (cm > 0 && cm < CAP_DETECT_CM && (now - last_detect_ms) > DEBOUNCE_MS) {
    last_detect_ms = now;

    uint8_t color = 4;
    if (camera_ok) {
      camera_fb_t* fb = esp_camera_fb_get();
      if (fb) {
        color = classifyByColor(fb);
        esp_camera_fb_return(fb);
      }
    }

    total_count++;
    Serial.printf("Cap #%u @ %.1fcm -> %s\n",
                  total_count, cm, COLOR_NAMES[color]);

    CapMessage m = { NODE_ID, total_count, color, now };
    esp_err_t r = esp_now_send(TOWER_MAC, (uint8_t*)&m, sizeof(m));
    if (r != ESP_OK) Serial.printf("  send err %d\n", r);
  }

  delay(80);
}