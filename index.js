<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta property="og:title" content="Smart Вільногірськ — Твій міський помічник">
<meta property="og:description" content="Розклад транспорту, барахолка, афіша подій та вакансії у Вільногірську.">
<meta property="og:image" content="https://vilnohirsk.online/preview-image.jpg">
<meta property="og:url" content="https://vilnohirsk.online">
<meta property="og:type" content="website">

<!-- Іконки для екрану телефона (iOS/Android) та браузера -->
<link rel="icon" type="image/png" href="https://github.com/denris87/vilnohirsk-site/blob/main/apple-touch-icon.png?raw=true">
<link rel="apple-touch-icon" href="https://github.com/denris87/vilnohirsk-site/blob/main/apple-touch-icon.png?raw=true">
<meta name="apple-mobile-web-app-title" content="Вільногірськ">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<title>Smart Вільногірськ</title>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<style>
:root{--highlight-color:#ffcc00;--glass-bg:rgba(0,0,0,0.45);--glass-border:rgba(255,255,255,0.08);--glass-border-light:rgba(255,255,255,0.15);--glass-shadow:0 16px 40px rgba(0,0,0,0.3);--time-green:#00ff9c;--time-passed:rgba(255,255,255,0.4)}html,body{margin:0;padding:0;min-height:100vh}*{-webkit-user-select:none;user-select:none;box-sizing:border-box;-webkit-tap-highlight-color:transparent;touch-action:manipulation}body{color:#fff;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,Helvetica,Arial,sans-serif;display:flex;justify-content:center;align-items:flex-start;min-height:100vh;background:linear-gradient(-45deg,#1e3c72,#2a5298,#009ffd,#2af598,#009ffd);background-size:300% 300%;animation:gradientMove 30s ease-in-out infinite alternate}@keyframes gradientMove{0%{background-position:0% 50%}100%{background-position:100% 50%}}.wrapper{width:100%;max-width:900px;padding:15px;padding-bottom:40px}.container{display:flex;flex-direction:column;gap:15px}.liquid-glass{background:var(--glass-bg);backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);border:1px solid var(--glass-border);border-top:1px solid var(--glass-border-light);border-left:1px solid var(--glass-border-light);box-shadow:var(--glass-shadow);border-radius:28px}.alert-main-widget{padding:0;border-radius:28px;position:relative;z-index:100}.alert-drawer{position:absolute;top:calc(100% + 10px);left:0;width:100%;max-height:0;overflow:hidden;opacity:0;pointer-events:none;transition:all 0.5s cubic-bezier(0.25,1,0.5,1);background:linear-gradient(135deg,#0b1d3a,#061124);border:1px solid rgba(255,255,255,0.15);box-shadow:0 30px 60px rgba(0,0,0,0.8);border-radius:24px;z-index:100}.alert-drawer.open{max-height:10000px;opacity:1;padding:15px;pointer-events:auto}.tab-alert{padding:14px 8px;border-radius:12px;font-weight:800;font-size:clamp(10px,3.2vw,14px);text-align:center;cursor:pointer;background:linear-gradient(145deg,rgba(20,30,50,0.9),rgba(10,15,30,0.95));border:1px solid rgba(255,255,255,0.05);transition:transform 0.2s,box-shadow 0.2s,background 0.3s;text-transform:uppercase;letter-spacing:0.5px;color:#fff;position:relative;display:flex;justify-content:center;align-items:center;line-height:1.2}

/* НОВІ НАСИЧЕНІ КОЛЬОРИ ДЛЯ ВЕРХНІХ ВКЛАДОК */
.tab-alert.communal{color:#FFD700;border-bottom:3px solid #FFD700;background:linear-gradient(145deg,rgba(255,215,0,0.15),rgba(10,15,30,0.95))}.tab-alert.communal.active{background:rgba(255,215,0,0.3);box-shadow:0 0 15px rgba(255,215,0,0.6);color:#fff}
.tab-alert.news{color:#00FF9D;border-bottom:3px solid #00FF9D;background:linear-gradient(145deg,rgba(0,255,157,0.15),rgba(10,15,30,0.95))}.tab-alert.news.active{background:rgba(0,255,157,0.3);box-shadow:0 0 15px rgba(0,255,157,0.6);color:#fff}
.tab-alert.events{color:#FF3366;border-bottom:3px solid #FF3366;background:linear-gradient(145deg,rgba(255,51,102,0.15),rgba(10,15,30,0.95));text-shadow:0 0 5px rgba(255,51,102,0.6);animation:neonPulse 2s infinite alternate}.tab-alert.events.active{background:rgba(255,51,102,0.3);box-shadow:0 0 15px rgba(255,51,102,0.8);color:#fff}
@keyframes neonPulse{0%{box-shadow:0 0 5px rgba(255,51,102,0.1)}100%{box-shadow:0 0 12px rgba(255,51,102,0.5)}}

.notification-dot{position:absolute;top:-4px;right:-4px;width:10px;height:10px;background:#ff3b3b;border-radius:50%;border:1px solid rgba(0,0,0,0.5);animation:pulseAlert 1.5s infinite;display:none;z-index:10}.train-alert-dot{position:absolute;top:-4px;right:-4px;width:8px;height:8px;background:#ff3b3b;border-radius:50%;border:1px solid rgba(0,0,0,0.5);animation:pulseAlert 1.5s infinite;z-index:5}.carousel-wrapper{width:100%;position:relative}.carousel-container{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:15px;scrollbar-width:none;-ms-overflow-style:none;scroll-behavior:smooth;padding-bottom:5px;align-items:center}.carousel-container::-webkit-scrollbar{display:none}.alert-item{background:rgba(41,128,185,0.3);border:1px solid rgba(116,185,255,0.2);border-radius:12px;padding:15px;flex:0 0 100%;scroll-snap-align:center;scroll-snap-stop:always;box-sizing:border-box}.alert-card-title{font-size:15px;font-weight:800;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px}.alert-card-text{font-size:14px;font-weight:500;line-height:1.5;text-align:left;color:rgba(255,255,255,0.9)}.alert-empty{text-align:center;font-size:13px;color:rgba(255,255,255,0.5);padding:15px;font-weight:600}.carousel-dots{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:10px}.carousel-dot{width:8px;height:8px;border-radius:50%;transition:background 0.3s,transform 0.3s}.carousel-dot.active{transform:scale(1.3)}.top-row{display:flex;flex-direction:row;justify-content:space-between;gap:12px;width:100%}.widget{padding:15px 10px;flex:1;min-height:125px;display:flex;flex-direction:column;justify-content:center;align-items:center;overflow:hidden;position:relative}.widget::before{content:'';position:absolute;top:0;left:0;right:0;height:35%;background:linear-gradient(to bottom,rgba(255,255,255,0.08),transparent);border-radius:28px 28px 0 0;pointer-events:none}.datetime{text-align:center;width:100%}#date{font-size:clamp(18px,4.8vw,24px);font-weight:800;white-space:nowrap;letter-spacing:0.5px}#time{font-size:clamp(16px,4.2vw,20px);font-weight:700;white-space:nowrap;color:#fff;font-variant-numeric:tabular-nums}.weekdays{display:flex;justify-content:center;gap:3px;font-size:clamp(9px,2.3vw,12px);font-weight:700;margin:6px 0;text-transform:uppercase;width:100%;padding:0 5px}.day{color:rgba(255,255,255,0.4);transition:0.3s ease}.day.active{background-color:#ff4d4d !important;color:#fff !important;border-radius:6px;padding:2px 5px;box-shadow:0 0 10px rgba(255,77,77,0.4)}.weather-box{position:relative;width:100%;height:95px;display:flex;align-items:center;justify-content:center}.weather-content{position:absolute;width:100%;transition:all 0.8s cubic-bezier(0.25,1,0.5,1);opacity:0;transform:translateY(10px) scale(0.95);text-align:center;pointer-events:none;display:flex;flex-direction:column;justify-content:center;align-items:center}.weather-content.active{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}.weather-city{font-weight:700;font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:4px;text-transform:uppercase;letter-spacing:1px}.weather-temp{font-size:clamp(24px,6.5vw,32px);font-weight:800;white-space:nowrap;text-shadow:0 2px 10px rgba(0,0,0,0.4);line-height:1.1}.weather-wind{font-size:13px;color:rgba(255,255,255,0.5);margin-top:6px;font-weight:500}.schedule-group,.market-group{display:flex;flex-direction:column;gap:8px;position:relative;z-index:90;width:100%}.market-group{z-index:80}.tabs-wrapper{position:relative;width:100%;border-radius:20px;display:flex;overflow:hidden}.tabs-nav{display:flex;flex-wrap:nowrap;width:100%;padding:6px;gap:8px;background:var(--glass-bg);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-radius:20px;position:relative;z-index:2;box-shadow:inset 0 2px 10px rgba(0,0,0,0.4),0 4px 15px rgba(0,0,0,0.2);border:1px solid var(--glass-border);overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}.tabs-nav::-webkit-scrollbar{display:none}.scroll-hint{position:absolute;right:0;top:0;bottom:0;width:45px;display:flex;align-items:center;justify-content:flex-end;padding-right:12px;background:linear-gradient(to right,rgba(0,0,0,0),rgba(0,0,0,0.9));border-radius:0 20px 20px 0;pointer-events:none;opacity:1;transition:opacity 0.4s ease;z-index:5}.scroll-hint.hidden{opacity:0}.scroll-hint span{color:var(--highlight-color);font-size:16px;font-weight:900;text-shadow:0 2px 4px rgba(0,0,0,0.8);animation:blinkArrow 1.5s infinite}@keyframes blinkArrow{0%,100%{transform:translateX(0);opacity:0.3}50%{transform:translateX(4px);opacity:1}}.tab-btn{flex:0 0 auto;padding:10px 14px;border:1px solid rgba(255,255,255,0.1);background:linear-gradient(145deg,rgba(255,255,255,0.1),rgba(0,0,0,0.25));box-shadow:2px 4px 8px rgba(0,0,0,0.2),inset 1px 1px 2px rgba(255,255,255,0.15);color:#fff;opacity:0.9;font-weight:700;cursor:pointer;border-radius:12px;transition:all 0.3s ease;font-size:clamp(11px,3.2vw,13px);white-space:nowrap;position:relative}.tab-btn.active{background:linear-gradient(145deg,rgba(255,255,255,0.3),rgba(255,255,255,0.1));color:#fff;opacity:1;border:1px solid rgba(255,255,255,0.3);text-shadow:0 1px 4px rgba(0,0,0,0.8);box-shadow:0 4px 12px rgba(0,0,0,0.4),inset 1px 1px 3px rgba(255,255,255,0.4);transform:translateY(-1px)}.content-section{display:none}.content-section.active{display:block;animation:tabFadeIn 0.3s ease-out forwards}@keyframes tabFadeIn{from{opacity:0}to{opacity:1}}.main-list-widget{position:absolute;top:calc(100% + 10px);left:0;width:100%;max-height:0;overflow:hidden;opacity:0;visibility:hidden;pointer-events:none;transition:max-height 0.5s ease-in-out,opacity 0.3s ease,padding 0.3s ease;background:linear-gradient(135deg,#0b1d3a,#061124);border:1px solid rgba(255,255,255,0.15);box-shadow:0 30px 60px rgba(0,0,0,0.8);border-radius:24px}.main-list-widget.open{max-height:15000px;opacity:1;visibility:visible;pointer-events:auto;padding:20px 10px}.table-head{display:grid;grid-template-columns:15% 1fr 18%;align-items:center;justify-items:center;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.15);padding:0 10px 10px 10px;margin-bottom:12px;font-size:10px;text-transform:uppercase;color:#74b9ff;letter-spacing:0.5px}.train{display:grid;grid-template-columns:15% 1fr 18%;align-items:center;justify-items:center;padding:14px 10px;margin-bottom:10px;cursor:pointer;transition:all 0.3s ease;border-radius:16px;min-height:60px;background:linear-gradient(145deg,rgba(255,255,255,0.05),rgba(0,0,0,0.2));box-shadow:0 4px 12px rgba(0,0,0,0.2),inset 0 1px 1px rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.05)}.train:hover{background:linear-gradient(145deg,rgba(255,255,255,0.08),rgba(0,0,0,0.3));transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,0.3),inset 0 1px 1px rgba(255,255,255,0.15)}.train:active{transform:translateY(1px);box-shadow:0 2px 5px rgba(0,0,0,0.2),inset 0 2px 4px rgba(0,0,0,0.3)}.train:last-child{margin-bottom:0}.train-num-box{position:relative;font-weight:800;display:inline-block;font-size:clamp(10px,2.8vw,12px);background:rgba(255,255,255,0.1);padding:4px 6px;border-radius:8px}.route-text{font-weight:700;color:#fff;text-align:center;font-size:clamp(9px,2.7vw,14px);width:100%;padding:0 5px;text-shadow:0 1px 4px rgba(0,0,0,0.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.time-val{font-weight:800;font-size:clamp(12px,3.2vw,15px);font-variant-numeric:tabular-nums}.time-val.soon{color:var(--highlight-color)}.time-val.future{color:var(--time-green)}.time-val.passed{color:var(--time-passed)}.details{max-height:0;overflow:hidden;opacity:0;transition:max-height 0.4s ease,opacity 0.3s ease,padding 0.3s ease;background:rgba(0,0,0,0.25);border-radius:16px}.details.open{max-height:5000px;opacity:1;padding:15px;margin-top:2px;margin-bottom:12px;border:1px solid rgba(255,255,255,0.05)}.schedule-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.bus-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media (max-width:600px){.schedule-grid,.bus-grid{grid-template-columns:1fr}}@media (max-width:550px){.top-row{flex-wrap:wrap}.widget{min-width:45%}}.schedule-column{background:rgba(41,128,185,0.3);border:1px solid rgba(116,185,255,0.2);border-radius:12px;padding:10px 8px}.schedule-row{display:flex;justify-content:space-between;padding:8px 6px;border-bottom:1px solid rgba(255,255,255,0.05);font-size:13px;align-items:center;gap:10px;text-align:left}.schedule-row:last-child{border-bottom:none}.schedule-left{flex:1;display:flex;align-items:flex-start;text-align:left;line-height:1.2;font-weight:500}.station-number{color:rgba(255,255,255,0.3);font-weight:600;margin-right:6px;font-size:10px;min-width:18px;text-align:right;padding-top:2px}.station-name-text{flex:1;word-wrap:break-word}.row-highlight{background:rgba(255,255,255,0.1) !important;color:var(--highlight-color) !important;font-weight:800;border-radius:6px;box-shadow:inset 0 1px 2px rgba(255,255,255,0.1)}.time-green{color:var(--time-green);font-weight:700;font-family:monospace;font-size:14px;text-align:right;white-space:nowrap}.time-passed{color:var(--time-passed);font-weight:500;font-family:monospace;font-size:14px;text-align:right;white-space:nowrap}.time-normal{color:#fff;font-weight:700;font-family:monospace;font-size:14px;text-align:right;white-space:nowrap}.details-note{text-align:center;font-weight:600;color:#ff6b6b;margin-bottom:10px;font-size:12px;line-height:1.5;background:rgba(255,107,107,0.1);padding:10px;border-radius:10px}.details-divider{width:50%;height:1px;background:rgba(255,255,255,0.1);margin:20px auto 15px}.shopping-drawer{max-height:0;overflow:hidden;opacity:0;pointer-events:none;transition:max-height 0.5s ease-in-out,opacity 0.4s ease,padding 0.4s ease;background:linear-gradient(135deg,#0b1d3a,#061124);border-radius:24px}.shopping-drawer.open{max-height:15000px;opacity:1;pointer-events:auto;padding:20px 15px;margin-top:5px;border:1px solid rgba(255,255,255,0.15);box-shadow:0 30px 60px rgba(0,0,0,0.8)}

/* ОНОВЛЕНА СІТКА З ЖОРСТКИМ ОБМЕЖЕННЯМ minmax(0, 1fr) - ЦЕ ЗАПОБІГАЄ РОЗРИВУ ЕКРАНУ */
.shops-tile-grid{display:grid;grid-template-columns:repeat(2,minmax(0, 1fr));gap:12px;align-items:stretch;grid-auto-flow:dense;transition:padding-bottom 0.3s ease}
@media (min-width:650px){.shops-tile-grid{grid-template-columns:repeat(3,minmax(0, 1fr))}}

/* ОНОВЛЕНА КАРТКА - ДОДАНО min-width: 0 */
.shop-tile{display:flex;flex-direction:column;background:linear-gradient(145deg,rgba(255,255,255,0.05),rgba(0,0,0,0.2));box-shadow:0 4px 12px rgba(0,0,0,0.2),inset 0 1px 1px rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.05);border-radius:16px;padding:10px;cursor:pointer;transition:transform 0.3s ease,box-shadow 0.3s ease;position:relative;z-index:1;min-width:0;box-sizing:border-box;}
.shop-tile:hover{background:linear-gradient(145deg,rgba(255,255,255,0.08),rgba(0,0,0,0.3));transform:translateY(-2px)}.shop-tile:active{transform:translateY(1px)}.shop-tile.tile-active{background:linear-gradient(145deg,rgba(255,255,255,0.1),rgba(0,0,0,0.3));box-shadow:0 8px 24px rgba(0,0,0,0.5),inset 0 1px 1px rgba(255,255,255,0.2);z-index:50 !important}

/* VIP ОГОЛОШЕННЯ (НА 1.5 РОЗМІРУ БІЛЬШЕ, НАСИЧЕНИЙ ФОН) */
.shop-tile.vip-tile, .vip-job-card {
  grid-column: 1 / -1;
  width: 85%;
  max-width: 480px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(255, 170, 0, 0.25), rgba(50, 15, 0, 0.9)) !important;
  border: 1px solid rgba(255, 204, 0, 0.4) !important;
  box-shadow: 0 10px 30px rgba(255, 170, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.15) !important;
  min-width: 0; box-sizing: border-box;
}
.shop-tile.vip-tile:hover, .vip-job-card:hover {
  background: linear-gradient(135deg, rgba(255, 180, 0, 0.35), rgba(60, 20, 0, 0.95)) !important;
  box-shadow: 0 12px 35px rgba(255, 180, 0, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.2) !important;
}
.shop-tile.vip-tile .shop-inner-list {
  background: linear-gradient(145deg, rgba(35, 25, 5, 0.98), rgba(15, 10, 0, 0.98)) !important;
  border: 1px solid rgba(255, 204, 0, 0.3) !important;
}
.vip-badge{position:absolute;top:-6px;right:-6px;background:linear-gradient(135deg,#ffcc00,#ff8800);color:#000;font-size:10px;font-weight:900;padding:4px 8px;border-radius:12px;box-shadow:0 4px 10px rgba(255,204,0,0.4);z-index:10;text-transform:uppercase;letter-spacing:1px;animation:vipPulse 2s infinite}

/* ОНОВЛЕНІ СТИЛІ ФОТОГРАФІЙ (ФІКСОВАНИЙ РОЗМІР + БЕЗ ОБРІЗКИ) */
.shop-tile-photo{width:100%;height:160px;border-radius:10px;background:rgba(0,0,0,0.3);display:flex;justify-content:center;align-items:center;overflow:hidden;margin-bottom:8px;border:1px solid rgba(255,255,255,0.05)}
.shop-tile.vip-tile .shop-tile-photo{height:190px;} /* Збільшено на 0.5 розміру (було 160) */
.shop-tile-photo img{width:100%;height:100%;object-fit:cover;display:block;}

.shop-tile-cat{font-size:10px;color:var(--highlight-color);font-weight:800;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;word-break:break-word;overflow-wrap:anywhere;}
.shop-tile-name{font-weight:800;font-size:13px;color:#fff;line-height:1.2;word-break:break-word;overflow-wrap:anywhere;}
.shop-tile-chevron{font-size:11px;color:var(--time-green);font-weight:800;margin-top:auto;text-align:center;background:rgba(0,255,156,0.1);padding:4px;border-radius:8px}

.shop-details-dropdown{position:absolute;top:calc(100% + 5px);left:0;width:100%;max-height:0;opacity:0;overflow:hidden;margin-top:0;transition:max-height 0.4s ease,opacity 0.3s ease,padding 0.3s ease;pointer-events:none;box-sizing:border-box;z-index:50}.shop-details-dropdown.open{max-height:3000px;opacity:1;pointer-events:auto}.shop-inner-list{display:flex;flex-direction:column;gap:8px;font-size:11px;text-align:left;color:rgba(255,255,255,0.85);background:rgba(11,29,58,0.98);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);box-shadow:0 15px 35px rgba(0,0,0,0.8)}.shop-inner-item{display:flex;gap:6px;align-items:flex-start;line-height:1.3}.detail-icon{flex-shrink:0;font-size:12px}.shop-phone-link{color:#2af598;text-decoration:none;font-weight:800;letter-spacing:0.5px}.blabla-actions{display:flex;gap:10px;margin-bottom:15px;padding:0 5px}.blabla-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:12px 5px;border-radius:14px;text-decoration:none;font-weight:800;font-size:14px;font-family:inherit;color:#0b1d3a;cursor:pointer;border:none;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 4px 15px rgba(0,0,0,0.3)}.blabla-btn:hover{transform:translateY(-2px)}.blabla-btn:active{transform:translateY(1px)}.btn-driver{background:linear-gradient(135deg,#00ff9c,#00b8ff)}.btn-passenger{background:linear-gradient(135deg,#ffcc00,#ff8800)}.blabla-subtext{font-size:10px;font-weight:600;opacity:0.8;margin-top:3px;text-transform:uppercase}.blabla-toggle-container{display:flex;background:rgba(0,0,0,0.3);border-radius:12px;padding:4px;margin-bottom:15px;border:1px solid rgba(255,255,255,0.05)}.blabla-tab-btn{flex:1;padding:8px;border:none;background:transparent;color:rgba(255,255,255,0.5);font-weight:700;font-size:12px;border-radius:8px;cursor:pointer;transition:0.3s}.blabla-tab-btn.active{background:rgba(255,255,255,0.15);color:#fff;box-shadow:0 2px 5px rgba(0,0,0,0.2)}

/* БЕЗПЕЧНА СІТКА КАРТОК (БЕЗ РОЗРИВІВ ЕКРАНУ) */
.cards-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;align-items:start;}@media (min-width:650px){.cards-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
.blabla-card{background:linear-gradient(145deg,rgba(255,255,255,0.05),rgba(0,0,0,0.2));border:1px solid rgba(255,255,255,0.05);border-radius:14px;padding:10px;box-shadow:0 4px 10px rgba(0,0,0,0.2);display:flex;flex-direction:column;gap:6px;font-size:11px;min-width:0;box-sizing:border-box;}
.blabla-route{font-size:12px;font-weight:800;color:#fff;display:flex;flex-direction:column;align-items:flex-start;gap:2px;line-height:1.2;word-break:break-word;overflow-wrap:anywhere;}
.blabla-date{font-size:10px;color:var(--highlight-color);font-weight:700;line-height:1.2;word-break:break-word;overflow-wrap:anywhere;}
.blabla-info-row{display:flex;flex-direction:column;font-size:10px;color:rgba(255,255,255,0.8);background:rgba(0,0,0,0.2);padding:6px 8px;border-radius:8px;align-items:flex-start;gap:4px;word-break:break-word;overflow-wrap:anywhere;}
.blabla-phone{font-size:12px;font-weight:800;color:var(--time-green);text-decoration:none}

.custom-modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);z-index:99999;display:flex;justify-content:center;align-items:flex-start;overflow-y:auto;padding:20px;opacity:0;pointer-events:none;transition:opacity 0.3s ease}.custom-modal-overlay.active{opacity:1;pointer-events:auto}.custom-modal-box{width:100%;max-width:400px;margin:auto;background:linear-gradient(145deg,rgba(20,30,50,0.9),rgba(10,15,30,0.95));border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:25px 20px;box-shadow:0 20px 50px rgba(0,0,0,0.5);transform:translateY(20px) scale(0.95);transition:transform 0.3s ease;position:relative}.custom-modal-overlay.active .custom-modal-box{transform:translateY(0) scale(1)}.close-modal-btn{position:absolute;top:15px;right:15px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;cursor:pointer}.form-title{margin:0 0 20px 0;font-size:18px;font-weight:800;text-align:center;text-transform:uppercase;color:var(--highlight-color)}.form-group{display:flex;flex-direction:column;margin-bottom:12px}.form-row{display:flex;gap:10px}.form-row .form-group{flex:1}.form-label{font-size:11px;font-weight:700;margin-bottom:5px;color:rgba(255,255,255,0.7);text-transform:uppercase}
.form-input{background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px;color:#fff;font-size:14px;font-family:inherit;outline:none;transition:border-color 0.2s;width:100%;max-width:100%;box-sizing:border-box;margin:0}
input[type="date"].form-input, input[type="time"].form-input{ -webkit-appearance:none; appearance:none; display:block; width:100%; }
.form-input:focus{border-color:var(--time-green);background:rgba(0,0,0,0.5)}.form-input::placeholder{color:rgba(255,255,255,0.3)}textarea.form-input{resize:none}select.form-input{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;background-size:20px;padding-right:30px}select.form-input option{background:#0b1d3a;color:#fff}input[type="file"].form-input{padding:8px;font-size:12px}.form-submit-btn{width:100%;padding:14px;margin-top:10px;border:none;border-radius:14px;font-size:15px;font-weight:800;color:#0b1d3a;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.3);transition:transform 0.2s}.form-submit-btn.driver{background:linear-gradient(135deg,#00ff9c,#00b8ff);box-shadow:0 4px 15px rgba(0,255,156,0.3)}.form-submit-btn.passenger{background:linear-gradient(135deg,#ffcc00,#ff8800);box-shadow:0 4px 15px rgba(255,204,0,0.3)}.form-submit-btn.flea,.form-submit-btn.lost{background:linear-gradient(135deg,#00ff9c,#00b8ff);box-shadow:0 4px 15px rgba(0,255,156,0.3)}.form-submit-btn:active{transform:translateY(2px)}
.image-modal{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.95);z-index:100000;display:flex;flex-direction:column;justify-content:center;align-items:center;opacity:0;pointer-events:none;transition:opacity 0.3s ease;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.image-modal.active{opacity:1;pointer-events:auto}
.image-modal-slider{width:100%;height:100%;overflow:hidden;position:relative}
.image-modal-track{display:flex;width:100%;height:100%;transition:transform 0.3s cubic-bezier(0.25,1,0.5,1);will-change:transform}
.image-modal-slide{flex:0 0 100%;width:100%;height:100%;display:flex;justify-content:center;align-items:center;position:relative}
.image-modal-slide img{max-width:95%;max-height:85%;object-fit:contain;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.8);transform:scale(0.9);transition:transform 0.3s ease;pointer-events:none}
.image-modal.active .image-modal-slide img{transform:scale(1)}
.image-modal-close{position:absolute;top:20px;right:20px;color:#fff;font-size:36px;font-weight:300;cursor:pointer;background:rgba(0,0,0,0.5);width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:100001}
#modal-image-counter{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:#fff;font-weight:700;font-size:14px;background:rgba(0,0,0,0.5);padding:6px 14px;border-radius:14px;z-index:100001;display:none}

/* НОВІ СТИЛІ ДЛЯ ТЕГІВ КАТЕГОРІЙ */
.flea-categories-wrapper {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding: 5px 15px 15px 15px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
}
.flea-categories-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
.flea-category-tag {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.flea-category-tag:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  transform: translateY(-2px);
}
.flea-category-tag.active {
  background: linear-gradient(135deg, #00ff9c, #00b8ff);
  color: #0b1d3a;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(0, 255, 156, 0.3);
}

/* СТИЛІ ДЛЯ ШТОРКИ БЕТА-ТЕСТУ */
.beta-drawer { max-height: 0; overflow: hidden; opacity: 0; transition: max-height 0.4s ease, opacity 0.3s ease, padding 0.3s ease; cursor: default; }
.beta-drawer.open { max-height: 500px; opacity: 1; padding-top: 15px; }

/* СТИЛІ ДОВІДНИКА ТА ВАКАНСІЙ (БЕЗПЕЧНА СІТКА) */
.guide-item-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 8px 0; }
.guide-item-row:last-child { border-bottom: none; padding-bottom: 0; }
.guide-item-title { font-weight: 600; color: rgba(255,255,255,0.85); font-size: 12px; }

.jobs-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; align-items: start; }
@media (max-width: 768px) { .jobs-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 550px) { .jobs-grid { grid-template-columns: minmax(0, 1fr); } }

/* СТИЛІ ДЛЯ СЕКЦІЙ ВАКАНСІЙ */
.section-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  margin: 15px 0;
}
.jobs-carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 12px;
  padding-bottom: 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.jobs-carousel::-webkit-scrollbar { display: none; }
.jobs-carousel-card {
  flex: 0 0 85%;
  max-width: 320px;
  scroll-snap-align: center;
}
@media (min-width: 650px) {
  .jobs-carousel-card { flex: 0 0 45%; }
}
</style>
</head>
<body>

<div id="auth-screen" style="display: none; justify-content: center; align-items: center; min-height: 100vh; width: 100%; padding: 20px;">
  <div class="liquid-glass" style="padding: 35px 25px; text-align: center; max-width: 400px; width: 100%; background: rgba(13, 25, 48, 0.95);">
    <h2 style="color: var(--highlight-color); margin-top: 0; margin-bottom: 15px; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Помилка доступу</h2>
    <p style="font-size: 15px; line-height: 1.5; margin: 0; color: rgba(255,255,255,0.9);">Цей додаток працює лише всередині Telegram-бота.</p>
  </div>
</div>

<div class="image-modal" id="image-modal" onclick="closeImageModal(event)">
  <div class="image-modal-close" onclick="closeImageModal(event)">&times;</div>
  <div class="image-modal-slider" ontouchstart="handleTouchStart(event)" ontouchmove="handleTouchMove(event)" ontouchend="handleTouchEnd(event)">
    <div class="image-modal-track" id="modal-image-track"></div>
  </div>
  <div id="modal-image-counter"></div>
</div>

<div class="custom-modal-overlay" id="blabla-modal" onclick="closeBlaBlaForm(event)">
  <div class="custom-modal-box" onclick="event.stopPropagation()">
    <div class="close-modal-btn" onclick="closeBlaBlaForm(event)">&times;</div>
    <h3 class="form-title" id="form-modal-title">Додати поїздку</h3>
    <form id="custom-blabla-form" onsubmit="submitBlaBlaForm(event)">
      <div class="form-group"><label class="form-label" id="label-name">Ім'я</label><input type="text" class="form-input" id="input-name" placeholder="Олександр" required maxlength="30"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Звідки</label><input type="text" class="form-input" id="input-from" placeholder="Вільногірськ" required maxlength="20"></div>
        <div class="form-group"><label class="form-label">Куди</label><input type="text" class="form-input" id="input-to" placeholder="Дніпро" required maxlength="20"></div>
      </div>
      <div class="form-group"><label class="form-label">Дата поїздки</label><input type="date" class="form-input" id="input-date" required></div>
      <div class="form-group">
        <label class="form-label" id="label-time">Час відправлення</label>
        <div style="display: flex; gap: 10px; align-items: center; width: 100%;">
          <input type="time" class="form-input" id="input-time-from" style="flex:1;" required>
          <span style="color: rgba(255,255,255,0.5); font-weight: bold;">-</span>
          <input type="time" class="form-input" id="input-time-to" style="flex:1;">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" id="label-seats">Вільних місць</label>
          <select class="form-input" id="input-seats" required><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option></select>
        </div>
        <div class="form-group" id="group-price"><label class="form-label">Ціна (грн)</label><input type="tel" class="form-input" id="input-price" placeholder="150" maxlength="6" oninput="this.value = this.value.replace(/[^0-9]/g, '')"></div>
      </div>
      <div class="form-group"><label class="form-label">Номер телефону</label><input type="tel" class="form-input" id="input-phone" pattern="^0[0-9]{9}$" placeholder="0971234567" required maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '')"></div>
      <div class="form-group"><label class="form-label">Коментар</label><textarea class="form-input" id="input-comment" rows="2"></textarea></div>
      <input type="hidden" id="input-type" value="">
      <button type="submit" class="form-submit-btn driver" id="form-submit-btn">Опублікувати</button>
    </form>
  </div>
</div>

<div class="custom-modal-overlay" id="flea-modal" onclick="closeFleaForm(event)">
  <div class="custom-modal-box" onclick="event.stopPropagation()">
    <div class="close-modal-btn" onclick="closeFleaForm(event)">&times;</div>
    <h3 class="form-title" style="color: #00ff9c;">📦 Додати оголошення</h3>
    <form id="custom-flea-form" onsubmit="submitFleaForm(event)">
      <div class="form-group"><label class="form-label">Назва товару</label><input type="text" class="form-input" name="title" required></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Категорія</label>
          <select class="form-input" name="category" required>
            <option value="Інше">Інше</option>
            <option value="Електроніка">Електроніка</option>
            <option value="Одяг">Одяг</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Стан</label><select class="form-input" name="condition" required><option value="Вживане">Вживане</option><option value="Нове">Нове</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Ціна (грн)</label><input type="tel" class="form-input" name="price" placeholder="500" required maxlength="6" oninput="this.value = this.value.replace(/[^0-9]/g, '')"></div>
        <div class="form-group"><label class="form-label">Локація</label><input type="text" class="form-input" name="location" value="Вільногірськ" required></div>
      </div>
      <div class="form-group"><label class="form-label">Опис товару</label><textarea class="form-input" name="description" rows="3" required></textarea></div>
      <div class="form-group"><label class="form-label">Фотографії (до 5)</label><input type="file" class="form-input" name="photos" accept="image/*" multiple required></div>
      <div class="form-group"><label class="form-label">Телефон</label><input type="tel" class="form-input" name="phone" pattern="^0[0-9]{9}$" placeholder="0971234567" required maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '')"></div>
      <button type="submit" class="form-submit-btn flea" id="flea-submit-btn">Опублікувати</button>
    </form>
  </div>
</div>

<div class="custom-modal-overlay" id="lost-modal" onclick="closeLostForm(event)">
  <div class="custom-modal-box" onclick="event.stopPropagation()">
    <div class="close-modal-btn" onclick="closeLostForm(event)">&times;</div>
    <h3 class="form-title" style="color: #e056fd;">🔍 Бюро знахідок</h3>
    <form id="custom-lost-form" onsubmit="submitLostForm(event)">
      <div class="form-group"><label class="form-label">Що сталося?</label><select class="form-input" name="type" required><option value="Знайдено">🔍 Я знайшов річ</option><option value="Втрачено">❗ Я загубив річ</option></select></div>
      <div class="form-group"><label class="form-label">Назва речі</label><input type="text" class="form-input" name="title" placeholder="Наприклад: Ключі від авто" required></div>
      <div class="form-group"><label class="form-label">Категорія</label><select class="form-input" name="category" required><option value="Ключі">Ключі</option><option value="Тварини">Тварини</option><option value="Документи">Документи</option><option value="Електроніка">Електроніка</option><option value="Інше">Інше</option></select></div>
      <div class="form-group"><label class="form-label">Опис та обставини</label><textarea class="form-input" name="description" rows="3" placeholder="Де і коли..." required></textarea></div>
      <div class="form-group"><label class="form-label">Локація</label><input type="text" class="form-input" name="location" value="Вільногірськ" required></div>
      <div class="form-group"><label class="form-label">Додати фото (якщо є)</label><input type="file" class="form-input" name="photos" accept="image/*" multiple></div>
      <div class="form-group"><label class="form-label">Ваш телефон</label><input type="tel" class="form-input" name="phone" pattern="^0[0-9]{9}$" placeholder="0971234567" required maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '')"></div>
      <button type="submit" class="form-submit-btn lost" id="lost-submit-btn">Опублікувати</button>
    </form>
  </div>
</div>

<div class="custom-modal-overlay" id="job-modal" onclick="closeJobForm(event)">
  <div class="custom-modal-box" onclick="event.stopPropagation()">
    <div class="close-modal-btn" onclick="closeJobForm(event)">&times;</div>
    <h3 class="form-title" style="color: #00b8ff;">💼 Додати вакансію</h3>
    <form id="custom-job-form" onsubmit="submitJobForm(event)">
      <div class="form-group"><label class="form-label">Посада</label><input type="text" class="form-input" name="title" placeholder="Наприклад: Продавець" required></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Зарплата</label><input type="tel" class="form-input" name="salary" placeholder="15000" required maxlength="6" oninput="this.value = this.value.replace(/[^0-9]/g, '')"></div>
        <div class="form-group"><label class="form-label">Компанія</label><input type="text" class="form-input" name="company" placeholder="Назва фірми" required></div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Кого шукають</label>
          <select class="form-input" name="gender" required>
            <option value="Не має значення">Не має значення</option>
            <option value="Чоловік">Чоловік</option>
            <option value="Жінка">Жінка</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Зайнятість</label>
          <select class="form-input" name="employment" required>
            <option value="Повна">Повна</option>
            <option value="Неповна">Неповна</option>
            <option value="Віддалена">Віддалена</option>
          </select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Опис</label><textarea class="form-input" name="description" rows="4" required></textarea></div>
      <div class="form-group"><label class="form-label">Телефон</label><input type="tel" class="form-input" name="phone" pattern="^0[0-9]{9}$" placeholder="0971234567" required maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '')"></div>
      <button type="submit" class="form-submit-btn" style="background: linear-gradient(135deg, #00b8ff, #0055ff); color: #fff;" id="job-submit-btn">Опублікувати</button>
    </form>
  </div>
</div>

<div id="main-app-content" style="display: none; width: 100%; justify-content: center;">
  <div class="wrapper">
  <div class="container">

    <div class="alert-main-widget liquid-glass" style="padding: 15px;">
        <div id="alert-tabs" style="display: flex; flex-direction: column; gap: 8px;">
            <div class="tab-alert news" onclick="openAlertTab('alert-news', this)" style="width: 100%;">Міські новини<span class="notification-dot" id="dot-news"></span></div>
            <div style="display: flex; gap: 8px; width: 100%;">
                <div class="tab-alert communal" onclick="openAlertTab('alert-communal', this)" style="flex: 1;">Комунальний інформер<span class="notification-dot" id="dot-communal"></span></div>
                <div class="tab-alert events" onclick="openAlertTab('alert-events', this)" style="flex: 1;">АФІШІ<span class="notification-dot" id="dot-events"></span></div>
            </div>
        </div>
        <div class="alert-drawer" id="alert-drawer" style="margin-top: 10px;">
            <div id="alert-communal" class="content-section"><div id="alert-communal-content" style="text-align: center; color: rgba(255,255,255,0.5);">Завантаження...</div></div>
            <div id="alert-news" class="content-section"><div id="alert-news-content" style="text-align: center; color: rgba(255,255,255,0.5);">Завантаження...</div></div>
            <div id="alert-events" class="content-section"><div id="alert-events-content" style="text-align: center; color: rgba(255,255,255,0.5);">Завантаження...</div></div>
        </div>
    </div>

    <div class="schedule-group">
      <div class="tabs-wrapper">
        <div class="tabs-nav" id="schedule-tabs">
          <button class="tab-btn" onclick="openScheduleTab('blablacar', this)">🚗 Bla Bla Car<span class="notification-dot" id="dot-blablacar"></span></button>
          <button class="tab-btn" onclick="openScheduleTab('trains', this)">🚆 Електрички<span class="notification-dot" id="dot-trains"></span></button>
          <button class="tab-btn" onclick="openScheduleTab('buses', this)">🚌 Автобуси</button>
          <button class="tab-btn" onclick="openScheduleTab('long-trains', this)">🛤️ Потяги</button>
        </div>
        <div class="scroll-hint" id="hint-schedule"><span>❯</span></div>
      </div>
      <div id="main-list-widget" class="main-list-widget">
        <div id="trains" class="content-section"><div id="list" style="text-align: center; padding: 20px; font-weight: 600; color: rgba(255,255,255,0.5);">Завантаження...</div></div>
        <div id="long-trains" class="content-section"><div id="long-trains-list" style="text-align: center; padding: 20px; font-weight: 600; color: rgba(255,255,255,0.5);">Завантаження...</div></div>
        <div id="buses" class="content-section"><div id="buses-list" style="text-align: center; padding: 20px; font-weight: 600; color: rgba(255,255,255,0.5);">Завантаження...</div></div>
        <div id="blablacar" class="content-section">
          <div class="blabla-actions">
            <button class="blabla-btn btn-driver" onclick="openBlaBlaForm('driver')">🚗 Ти водій<span class="blabla-subtext">Запропонувати</span></button>
            <button class="blabla-btn btn-passenger" onclick="openBlaBlaForm('passenger')">🧍 Ти пасажир<span class="blabla-subtext">Знайти місце</span></button>
          </div>
          <div class="blabla-toggle-container">
            <button class="blabla-tab-btn active" id="btn-show-drivers" onclick="switchBlaBlaList('drivers')">🚘 Пропозиції водіїв</button>
            <button class="blabla-tab-btn" id="btn-show-passengers" onclick="switchBlaBlaList('passengers')">🙋‍♂️ Запити пасажирів</button>
          </div>
          <div id="blabla-drivers-list"></div>
          <div id="blabla-passengers-list" style="display: none;"></div>
          <div style="text-align: center; padding: 15px 10px 5px 10px; font-size: 11px; opacity: 0.6; color: #fff;">
            Для видалення неактуального оголошення пишіть: <b style="color:var(--time-green)">@vilnohirsk</b>
          </div>
        </div>
      </div>
    </div>

    <div class="top-row">
      <div class="widget liquid-glass">
        <div class="datetime"><div id="date"></div><div class="weekdays"><div class="day">пн</div><div class="day">вт</div><div class="day">ср</div><div class="day">чт</div><div class="day">пт</div><div class="day">сб</div><div class="day">нд</div></div><div id="time"></div></div>
      </div>
      <div class="widget liquid-glass"><div class="weather-box" id="weather-container"></div></div>
    </div>

    <div class="market-group">
      <div class="tabs-wrapper">
        <div class="tabs-nav" id="market-tabs">
          <button class="tab-btn" onclick="openMarketTab('shopping-tab', this)">🛍 Шопінг<span class="notification-dot" id="dot-shopping"></span></button>
          <button class="tab-btn" onclick="openMarketTab('flea-market-tab', this)">📦 Барахолка<span class="notification-dot" id="dot-flea"></span></button>
          <button class="tab-btn" onclick="openMarketTab('jobs-tab', this)">💼 Вакансії<span class="notification-dot" id="dot-jobs"></span></button>
          <button class="tab-btn" onclick="openMarketTab('lost-found-tab', this)">🔍 Знахідки<span class="notification-dot" id="dot-lost"></span></button>
          <button class="tab-btn" onclick="openMarketTab('city-guide-tab', this)">📖 Міський довідник</button>
        </div>
        <div class="scroll-hint" id="hint-market"><span>❯</span></div>
      </div>
      <div class="shopping-drawer" id="market-drawer">
        <div id="shopping-tab" class="content-section"><div id="shopping-list-content"></div></div>
        
        <div id="flea-market-tab" class="content-section">
          <div style="padding: 10px; text-align: center;"><button onclick="openFleaForm()" style="border:none; background: linear-gradient(135deg, #00ff9c, #00b8ff); color: #0b1d3a; font-weight: 800; padding: 12px 20px; border-radius: 12px; cursor: pointer;">➕ Додати оголошення</button></div>
          
          <div class="flea-categories-wrapper" id="flea-categories">
            <div class="flea-category-tag active" onclick="filterFleaMarket('Всі', this)">Всі</div>
            <div class="flea-category-tag" onclick="filterFleaMarket('Електроніка', this)">Електроніка</div>
            <div class="flea-category-tag" onclick="filterFleaMarket('Одяг', this)">Одяг</div>
            <div class="flea-category-tag" onclick="filterFleaMarket('Інше', this)">Інше</div>
          </div>
          
          <div id="flea-market-list-content"></div>
        </div>
        
        <div id="lost-found-tab" class="content-section">
          <div style="padding: 10px; text-align: center;"><button onclick="openLostForm()" style="border:none; background: linear-gradient(135deg, #e056fd, #8c7ae6); color: #fff; font-weight: 800; padding: 12px 20px; border-radius: 12px; cursor: pointer;">➕ Повідомити про знахідку/втрату</button></div>
          <div id="lost-found-list-content"></div>
        </div>

        <div id="jobs-tab" class="content-section">
          <div style="padding: 10px; text-align: center;"><button onclick="openJobForm()" style="border:none; background: linear-gradient(135deg, #00b8ff, #0055ff); color: #fff; font-weight: 800; padding: 12px 20px; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 15px rgba(0, 184, 255, 0.3);">➕ Додати вакансію</button></div>
          <div style="padding: 10px; text-align: center; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.6); margin-bottom: 5px;">
            Актуальні вакансії у Вільногірську
          </div>
          <div id="jobs-list-content" style="text-align: center; padding: 20px; color: rgba(255,255,255,0.5);">
            Завантаження вакансій...
          </div>
        </div>

        <div id="city-guide-tab" class="content-section">
          <div style="text-align: center; padding: 30px; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.4);">
            Вміст оновлюється...
          </div>
        </div>
      </div>
    </div>

    <!-- БЛОК ВІДГУКІВ БЕТА-ТЕСТУ -->
    <div class="liquid-glass" style="padding: 15px; text-align: center; margin-top: 5px; cursor: pointer; border: 1px solid rgba(0, 255, 156, 0.3); background: rgba(0, 255, 156, 0.05);" onclick="document.getElementById('beta-drawer').classList.toggle('open')">
      <div style="font-size: 13px; font-weight: 600; color: #fff; line-height: 1.4;">
        <span style="font-size: 18px; display: block; margin-bottom: 5px;">👋</span>
        Якщо ви бачите це повідомлення, то вітаю, ви потрапили до бета-тестування. Свої перші враження від використання сайту залиште тут. <span style="color: var(--time-green);">▾</span>
      </div>
      <div class="beta-drawer" id="beta-drawer" onclick="event.stopPropagation()">
        <textarea class="form-input" id="beta-feedback-text" rows="3" placeholder="Напишіть ваші враження чи пропозиції..." style="margin-bottom: 10px;"></textarea>
        <button class="form-submit-btn" style="background: linear-gradient(135deg, #00ff9c, #00b8ff); box-shadow: 0 4px 15px rgba(0, 255, 156, 0.3); margin-top: 0;" onclick="submitBetaFeedback(event)">Відправити відгук</button>
      </div>
    </div>

  </div>
  </div>
</div>

<script>
// ГЛОБАЛЬНА ЄДИНА СИЛКА ДЛЯ ВСІХ ФОРМ
const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbywM7gXvtsu3k6Zfaxd6z4TVTXpu_gqs2l_1HxXJUfKM9vHAVJF6b_p3QOusUYFseTt/exec';

const REQUIRE_TELEGRAM = false; 

// Безпечне підключення Telegram
let tg = null;
try {
    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        tg.ready();
    }
} catch (e) {
    console.log("Telegram WebApp not found");
}

let isInsideTelegram = false;

if (tg && tg.platform && tg.platform !== "unknown") {
  isInsideTelegram = true;
} else if (tg && tg.initDataUnsafe && Object.keys(tg.initDataUnsafe).length > 0) {
  isInsideTelegram = true;
} else if (tg && tg.initData && tg.initData.length > 0) {
  isInsideTelegram = true;
} else if (navigator.userAgent.toLowerCase().includes('telegram')) {
  isInsideTelegram = true;
}

if (REQUIRE_TELEGRAM && !isInsideTelegram) {
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('main-app-content').style.display = 'none';
} else {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('main-app-content').style.display = 'flex'; 

  if (tg && tg.expand) { tg.expand(); }

  window.currentDataSignature = {};
  window.allFleaMarketItems = [];

  const compressAndGetBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 1000;
              const MAX_HEIGHT = 1000;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                  if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
              } else {
                  if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
              resolve(dataUrl.split(',')[1]); 
          };
      };
      reader.onerror = error => reject(error);
  });

  function checkNotification(key, dataArray) {
    if (!dataArray || dataArray.length === 0) return;
    const signature = String(dataArray.length);
    window.currentDataSignature[key] = signature;
    const seenSignature = localStorage.getItem('seen_' + key);
    const dot = document.getElementById('dot-' + key);
    if (dot && signature !== seenSignature) { dot.style.display = 'block'; }
  }

  function clearNotification(key) {
    const dot = document.getElementById('dot-' + key);
    if (dot) dot.style.display = 'none';
    if (window.currentDataSignature[key]) { localStorage.setItem('seen_' + key, window.currentDataSignature[key]); }
  }

  window.toggleShop = function(detailsId, tileElement) {
    const dropdown = document.getElementById(detailsId);
    if (!dropdown) return;
    const isOpen = dropdown.classList.contains('open');
    closeAllShopDropdowns();
    if (!isOpen) {
      dropdown.classList.add('open');
      tileElement.classList.add('tile-active');
      const grid = tileElement.closest('.shops-tile-grid');
      if (grid) { setTimeout(() => { grid.style.paddingBottom = (dropdown.scrollHeight + 15) + 'px'; }, 50); }
    }
  };

  function closeAllShopDropdowns() {
    document.querySelectorAll('.shop-details-dropdown.open').forEach(el => {
      el.classList.remove('open');
      if (el.parentElement) el.parentElement.classList.remove('tile-active');
    });
    document.querySelectorAll('.shops-tile-grid').forEach(grid => { grid.style.paddingBottom = '0px'; });
  }

  window.openFleaForm = function() {
    document.getElementById('custom-flea-form').reset();
    document.getElementById('flea-modal').classList.add('active');
  };

  window.closeFleaForm = function(event) {
    if (!event || event.target.classList.contains('close-modal-btn')) {
      document.getElementById('flea-modal').classList.remove('active');
    }
  };

  window.submitFleaForm = async function(event) {
    event.preventDefault(); 
    const submitBtn = document.getElementById('flea-submit-btn');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Обробка фото...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    try {
      const form = document.getElementById('custom-flea-form');
      const formData = new FormData(form);
      const photos = document.querySelector('#custom-flea-form input[name="photos"]').files;
      
      let base64Photos = [];

      if (photos.length > 5) throw new Error('Можна додати максимум 5 фото!');

      for (let i = 0; i < photos.length; i++) {
        const b64 = await compressAndGetBase64(photos[i]);
        base64Photos.push(b64);
      }

      submitBtn.innerText = 'Збереження...';
      const sheetData = {
        formType: 'flea',
        title: formData.get('title'),
        category: formData.get('category'),
        condition: formData.get('condition'),
        price: formData.get('price'),
        location: formData.get('location'),
        description: formData.get('description'),
        phone: formData.get('phone'),
        photosBase64: base64Photos
      };

      await fetch(APP_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(sheetData)
      });

      alert('✅ Ваше оголошення успішно відправлено на модерацію!');
      closeFleaForm();
    } catch (error) {
      alert('❌ Помилка: ' + error.message);
    } finally {
      submitBtn.innerText = originalBtnText; submitBtn.disabled = false; submitBtn.style.opacity = '1';
    }
  };

  window.openLostForm = function() {
    document.getElementById('custom-lost-form').reset();
    document.getElementById('lost-modal').classList.add('active');
  };

  window.closeLostForm = function(event) {
    if (!event || event.target.classList.contains('close-modal-btn')) {
      document.getElementById('lost-modal').classList.remove('active');
    }
  };

  window.submitLostForm = async function(event) {
    event.preventDefault(); 
    const submitBtn = document.getElementById('lost-submit-btn');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Обробка фото...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    try {
      const form = document.getElementById('custom-lost-form');
      const formData = new FormData(form);
      const photos = document.querySelector('#custom-lost-form input[name="photos"]').files;
      let base64Photos = [];

      if (photos.length > 0) {
        if (photos.length > 5) throw new Error('Можна додати максимум 5 фото!');
        for (let i = 0; i < photos.length; i++) {
          const b64 = await compressAndGetBase64(photos[i]);
          base64Photos.push(b64);
        }
      }

      submitBtn.innerText = 'Збереження...';
      const sheetData = {
        formType: 'lost',
        title: formData.get('title'),
        type: formData.get('type'),
        category: formData.get('category'),
        location: formData.get('location'),
        description: formData.get('description'),
        phone: formData.get('phone'),
        photosBase64: base64Photos
      };

      await fetch(APP_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(sheetData)
      });

      alert('✅ Ваше повідомлення успішно відправлено!');
      closeLostForm();
    } catch (error) {
      alert('❌ Помилка: ' + error.message);
    } finally {
      submitBtn.innerText = originalBtnText; submitBtn.disabled = false; submitBtn.style.opacity = '1';
    }
  };

  window.openJobForm = function() {
    document.getElementById('custom-job-form').reset();
    document.getElementById('job-modal').classList.add('active');
  };

  window.closeJobForm = function(event) {
    if (!event || event.target.classList.contains('close-modal-btn')) {
      document.getElementById('job-modal').classList.remove('active');
    }
  };

  window.submitJobForm = async function(event) {
    event.preventDefault(); 
    const submitBtn = document.getElementById('job-submit-btn');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Відправка...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    try {
      const form = document.getElementById('custom-job-form');
      const formData = new FormData(form);

      const sheetData = {
        formType: 'job',
        title: formData.get('title'),
        salary: formData.get('salary'),
        company: formData.get('company'),
        gender: formData.get('gender'),
        employment: formData.get('employment'),
        description: formData.get('description'),
        phone: formData.get('phone')
      };

      await fetch(APP_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(sheetData)
      });

      alert('✅ Вакансія успішно відправлена на модерацію!');
      closeJobForm();
    } catch (error) {
      alert('❌ Помилка: ' + error.message);
    } finally {
      submitBtn.innerText = originalBtnText; submitBtn.disabled = false; submitBtn.style.opacity = '1';
    }
  };

  window.submitBetaFeedback = async function(event) {
    event.preventDefault();
    const textEl = document.getElementById('beta-feedback-text');
    const text = textEl.value.trim();
    if (!text) {
      alert('Будь ласка, напишіть текст відгуку.');
      return;
    }
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = 'Відправка...';
    btn.disabled = true;

    try {
      await fetch(APP_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ formType: 'feedback', text: text })
      });

      alert('✅ Дякуємо! Ваш відгук успішно відправлено.');
      textEl.value = '';
      document.getElementById('beta-drawer').classList.remove('open');
    } catch(e) {
      alert('❌ Помилка: ' + e.message);
    } finally {
      btn.innerText = originalText;
      btn.disabled = false;
    }
  };

  window.openBlaBlaForm = function(type) {
    const modal = document.getElementById('blabla-modal');
    const title = document.getElementById('form-modal-title');
    const timeLabel = document.getElementById('label-time');
    const seatsLabel = document.getElementById('label-seats');
    const priceGroup = document.getElementById('group-price');
    const priceInput = document.getElementById('input-price');
    const submitBtn = document.getElementById('form-submit-btn');
    const typeInput = document.getElementById('input-type');
    const nameLabel = document.getElementById('label-name');

    document.getElementById('custom-blabla-form').reset();
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('input-date').setAttribute('min', today);
    document.getElementById('input-date').value = today;

    if (type === 'driver') {
      title.innerText = '🚘 Запропонувати поїздку';
      title.style.color = '#00ff9c';
      nameLabel.innerText = 'Ім\'я водія';
      timeLabel.innerText = 'Час відправлення';
      seatsLabel.innerText = 'Вільних місць';
      priceGroup.style.display = 'flex';
      priceInput.required = true;
      submitBtn.className = 'form-submit-btn driver';
      typeInput.value = 'driver';
    } else {
      title.innerText = '🙋‍♂️ Знайти авто';
      title.style.color = '#ffcc00';
      nameLabel.innerText = 'Ваше ім\'я';
      timeLabel.innerText = 'Бажаний час';
      seatsLabel.innerText = 'Потрібно місць';
      priceGroup.style.display = 'none';
      priceInput.required = false;
      submitBtn.className = 'form-submit-btn passenger';
      typeInput.value = 'passenger';
    }

    modal.classList.add('active');
  };

  window.closeBlaBlaForm = function(event) {
    if (!event || event.target.classList.contains('close-modal-btn')) {
      document.getElementById('blabla-modal').classList.remove('active');
    }
  };

  window.submitBlaBlaForm = async function(event) {
    event.preventDefault(); 
    const submitBtn = document.getElementById('form-submit-btn');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Відправка...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    const formData = {
      type: document.getElementById('input-type').value,
      name: document.getElementById('input-name').value,
      from: document.getElementById('input-from').value,
      to: document.getElementById('input-to').value,
      date: document.getElementById('input-date').value,
      time: document.getElementById('input-time-to').value ? `${document.getElementById('input-time-from').value} - ${document.getElementById('input-time-to').value}` : document.getElementById('input-time-from').value,
      seats: parseInt(document.getElementById('input-seats').value, 10),
      price: document.getElementById('input-price').value ? parseInt(document.getElementById('input-price').value, 10) : 0,
      phone: document.getElementById('input-phone').value,
      comment: document.getElementById('input-comment').value
    };

    try {
      const API_URL = 'https://vilnohirsk-blablacar-api-production-67d3.up.railway.app/api/rides'; 
      const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (!response.ok) throw new Error('Помилка сервера при збереженні');
      alert('✅ Ваше оголошення успішно додано!');
      closeBlaBlaForm();
      switchBlaBlaList(formData.type === 'driver' ? 'drivers' : 'passengers');
      loadBlaBlaCarData(); 
    } catch (error) {
      alert('❌ Помилка при відправці: ' + error.message);
    } finally {
      submitBtn.innerText = originalBtnText; submitBtn.disabled = false; submitBtn.style.opacity = '1';
    }
  };

  window.switchBlaBlaList = function(type) {
    document.querySelectorAll('.blabla-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('blabla-drivers-list').style.display = 'none';
    document.getElementById('blabla-passengers-list').style.display = 'none';
    if (type === 'drivers') {
      document.getElementById('btn-show-drivers').classList.add('active');
      document.getElementById('blabla-drivers-list').style.display = 'block';
    } else {
      document.getElementById('btn-show-passengers').classList.add('active');
      document.getElementById('blabla-passengers-list').style.display = 'block';
    }
  };

  function handleScrollHint(navId, hintId) {
    const nav = document.getElementById(navId); const hint = document.getElementById(hintId);
    if (!nav || !hint) return;
    const checkScroll = () => { if (nav.scrollWidth - nav.clientWidth <= nav.scrollLeft + 5) { hint.classList.add('hidden'); } else { hint.classList.remove('hidden'); } };
    nav.addEventListener('scroll', checkScroll); window.addEventListener('resize', checkScroll); setTimeout(checkScroll, 300);
  }
  handleScrollHint('schedule-tabs', 'hint-schedule');
  handleScrollHint('market-tabs', 'hint-market');

  let currentGallery = []; let currentGalleryIndex = 0; let touchStartX = 0; let touchEndX = 0;
  window.currentEventImages = [];

  window.openImageModal = function(images, index, event) {
    if (event) event.stopPropagation();
    if (typeof images === 'string') { currentGallery = [images]; currentGalleryIndex = 0; }
    else { currentGallery = images; currentGalleryIndex = index || 0; }
    
    const track = document.getElementById('modal-image-track');
    track.innerHTML = currentGallery.map(src => `<div class="image-modal-slide" onclick="handleSlideClick(event)"><img src="${src}" alt="Фото"></div>`).join('');
    
    track.style.transition = 'none';
    updateModalImage(); 
    
    document.getElementById('image-modal').classList.add('active');
    setTimeout(() => { track.style.transition = 'transform 0.3s cubic-bezier(0.25,1,0.5,1)'; }, 50);
  };

  window.updateModalImage = function() {
     const track = document.getElementById('modal-image-track');
     if (track) track.style.transform = `translateX(-${currentGalleryIndex * 100}%)`;

     const counter = document.getElementById('modal-image-counter');
     if (currentGallery.length > 1) { 
         counter.style.display = 'block';
         counter.innerText = `${currentGalleryIndex + 1} з ${currentGallery.length}`; 
     } else { 
         counter.style.display = 'none'; 
     }
  };

  window.handleSlideClick = function(e) {
     e.stopPropagation();
     if (currentGallery.length <= 1) return;
     if (e.clientX > window.innerWidth / 2) nextModalImage();
     else prevModalImage();
  };

  window.prevModalImage = function() {
     if (currentGallery.length <= 1 || currentGalleryIndex === 0) return;
     currentGalleryIndex--;
     updateModalImage();
  };

  window.nextModalImage = function() {
     if (currentGallery.length <= 1 || currentGalleryIndex === currentGallery.length - 1) return;
     currentGalleryIndex++;
     updateModalImage();
  };

  window.handleTouchStart = function(e) { 
      touchStartX = e.touches[0].clientX; 
      const track = document.getElementById('modal-image-track');
      if(track) track.style.transition = 'none';
  };
  
  window.handleTouchMove = function(e) {
      if (currentGallery.length <= 1) return;
      const diffX = e.touches[0].clientX - touchStartX;
      const track = document.getElementById('modal-image-track');
      if(track) track.style.transform = `translateX(calc(-${currentGalleryIndex * 100}% + ${diffX}px))`;
  };

  window.handleTouchEnd = function(e) {
    touchEndX = e.changedTouches[0].clientX;
    const track = document.getElementById('modal-image-track');
    if(track) track.style.transition = 'transform 0.3s cubic-bezier(0.25,1,0.5,1)';
    
    if (currentGallery.length <= 1) return;
    
    if (touchEndX < touchStartX - 50) { 
        nextModalImage(); 
    } else if (touchEndX > touchStartX + 50) { 
        prevModalImage(); 
    } else {
        updateModalImage(); 
    }
  };

  window.closeImageModal = function(event) {
    if (event && event.target.id !== 'image-modal' && !event.target.classList.contains('image-modal-close') && !event.target.classList.contains('image-modal-slider') && !event.target.classList.contains('image-modal-slide')) { return; }
    document.getElementById('image-modal').classList.remove('active');
  };

  document.addEventListener('click', function(e) {
    if (e.target.closest('.image-modal') || e.target.closest('.custom-modal-box')) return;
    if (!e.target.closest('.alert-main-widget')) {
      const alertDrawer = document.getElementById('alert-drawer');
      if (alertDrawer) { alertDrawer.classList.remove('open'); document.querySelectorAll('#alert-tabs .tab-alert').forEach(b => b.classList.remove('active')); }
    }
    if (!e.target.closest('.train') && !e.target.closest('.details')) { document.querySelectorAll('.details.open').forEach(el => el.classList.remove('open')); }
    if (!e.target.closest('.shop-tile')) { closeAllShopDropdowns(); }
    if (!e.target.closest('.schedule-group')) {
      const transportWidget = document.getElementById('main-list-widget'); if (transportWidget) transportWidget.classList.remove('open');
      document.querySelectorAll('#schedule-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    }
    if (!e.target.closest('.market-group')) {
      const marketWidget = document.getElementById('market-drawer'); if (marketWidget) marketWidget.classList.remove('open');
      document.querySelectorAll('#market-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    }
  });

  window.recalcDropdownHeight = function(imgEl) {
    const dropdown = imgEl.closest('.shop-details-dropdown');
    const grid = imgEl.closest('.shops-tile-grid');
    if (dropdown && dropdown.classList.contains('open') && grid) { grid.style.paddingBottom = (dropdown.scrollHeight + 15) + 'px'; }
  };

  window.openAlertTab = function(tabId, btn) {
    try {
      closeAllShopDropdowns(); 
      if (tabId === 'alert-communal') clearNotification('communal');
      if (tabId === 'alert-news') clearNotification('news');
      if (tabId === 'alert-events') clearNotification('events');
      
      document.getElementById('main-list-widget').classList.remove('open');
      document.querySelectorAll('#schedule-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('market-drawer').classList.remove('open');
      document.querySelectorAll('#market-tabs .tab-btn').forEach(b => b.classList.remove('active'));

      const drawer = document.getElementById('alert-drawer');
      
      // Очищаємо всі кольорові класи перед зміною
      drawer.classList.remove('drawer-events');

      if (btn.classList.contains('active')) { 
          btn.classList.remove('active'); 
          drawer.classList.remove('open'); 
          return; 
      }
      
      // Додаємо підсвітку ТІЛЬКИ для Афіш (як ви просили)
      if(tabId === 'alert-events') drawer.classList.add('drawer-events');
      
      document.querySelectorAll('#alert-tabs .tab-alert').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#alert-drawer .content-section').forEach(s => s.classList.remove('active'));
      
      btn.classList.add('active'); document.getElementById(tabId).classList.add('active'); drawer.classList.add('open');
    } catch (e) { console.error(e); }
  };

  window.openScheduleTab = function(tabId, btn) {
    try {
      if (tabId === 'blablacar') clearNotification('blablacar');
      if (tabId === 'trains') clearNotification('trains');
      
      closeAllShopDropdowns(); 
      document.getElementById('market-drawer').classList.remove('open');
      document.querySelectorAll('#market-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('alert-drawer').classList.remove('open');
      document.querySelectorAll('#alert-tabs .tab-alert').forEach(b => b.classList.remove('active'));

      const widget = document.getElementById('main-list-widget');
      if (btn.classList.contains('active')) { btn.classList.remove('active'); widget.classList.remove('open'); return; }
      document.querySelectorAll('#schedule-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#main-list-widget .content-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active'); document.getElementById(tabId).classList.add('active'); widget.classList.add('open');
    } catch (e) { console.error(e); }
  };

  window.openMarketTab = function(tabId, btn) {
    try {
      if (tabId === 'shopping-tab') clearNotification('shopping');
      if (tabId === 'flea-market-tab') clearNotification('flea');
      if (tabId === 'lost-found-tab') clearNotification('lost');
      if (tabId === 'jobs-tab') clearNotification('jobs');

      closeAllShopDropdowns();
      document.getElementById('main-list-widget').classList.remove('open');
      document.querySelectorAll('#schedule-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('alert-drawer').classList.remove('open');
      document.querySelectorAll('#alert-tabs .tab-alert').forEach(b => b.classList.remove('active'));

      const widget = document.getElementById('market-drawer');
      if (btn.classList.contains('active')) { btn.classList.remove('active'); widget.classList.remove('open'); return; }
      document.querySelectorAll('#market-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#market-drawer .content-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active'); document.getElementById(tabId).classList.add('active'); widget.classList.add('open');
    } catch(e) { console.error(e); }
  };

  function getKyivNow(){ return new Date(new Date().toLocaleString("en-US",{timeZone:"Europe/Kyiv"})); }
  
  function getWeatherEmoji(code){
    if(code === 0) return "☀️"; if(code <= 2) return "⛅"; if(code <= 3) return "☁️"; if(code <= 48) return "🌫️";
    if(code <= 67) return "🌧️"; if(code <= 77) return "🌨️"; if(code <= 99) return "⛈️"; return "🌡️";
  }

  async function loadWeather(){
    const coords = [{name: 'Вільногірськ', lat: 48.48, lon: 34.02}, {name: 'Дніпро', lat: 48.45, lon: 34.98}];
    let results = [];
    for(let c of coords){
      try {
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true&timezone=Europe%2FKyiv`);
        const d = await r.json(); results.push({name: c.name, w: d.current_weather});
      } catch(e) {}
    }
    const container = document.getElementById("weather-container");
    if(results.length === 0) return;
    container.innerHTML = results.map((item, index) => `<div class="weather-content ${index === 0 ? 'active' : ''}"><div class="weather-city">${item.name}</div><div class="weather-temp">${getWeatherEmoji(item.w.weathercode)} ${Math.round(item.w.temperature)}°C</div><div class="weather-wind">💨 ${Math.round(item.w.windspeed)} м/с</div></div>`).join("");
    let currentIndex = 0;
    setInterval(() => {
      const slides = document.querySelectorAll('.weather-content');
      if(slides.length < 2) return;
      slides[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add('active');
    }, 7000); 
  }

  function updateDateTime(){
    try {
      const now = getKyivNow();
      document.getElementById("date").textContent=`${String(now.getDate()).padStart(2,"0")}.${String(now.getMonth()+1).padStart(2,"0")}.${now.getFullYear()}`;
      document.getElementById("time").textContent=`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
      const days=document.querySelectorAll(".day"); days.forEach(d=>d.classList.remove("active"));
      let i=now.getDay(); i=i===0?6:i-1; days[i].classList.add("active");
    } catch(e) {}
  }

  function buildCarouselHtml(items, typeColor, typeId, isEvent = false) {
    if (!items || items.length === 0) {
      if (isEvent) return `<div class="alert-empty" style="margin-bottom:15px;">Афіш поки немає</div>`;
      return `<div class="alert-empty">Актуальних повідомлень немає</div>`;
    }
    const slidesHtml = items.map((item, index) => {
      if(!item) return '';
      if (isEvent) {
        const photoUrl = item.photo || item.image || item.url;
        if(!photoUrl) return '';
        return `<div class="alert-item" style="padding:0; background:transparent; border:none; display:flex; justify-content:center; align-items:center;">
                  <img src="${photoUrl}" style="max-width:100%; max-height:350px; object-fit:contain; border-radius:12px; box-shadow: 0 4px 15px rgba(224, 86, 253, 0.4); cursor:pointer;" alt="Афіша" onclick="openImageModal(window.currentEventImages, ${index}, event)">
                </div>`;
      } else {
        const textHtml = item.text ? String(item.text).replace(/\n/g, '<br>') : '';
        return `<div class="alert-item">
                  ${item.title ? `<div class="alert-card-title" style="color: ${typeColor};">${item.title}</div>` : ''}
                  <div class="alert-card-text">${textHtml}</div>
                </div>`;
      }
    }).join("");
    if (items.length === 1) return `<div class="carousel-wrapper"><div class="carousel-container">${slidesHtml}</div></div>`;
    const dotsHtml = items.map((_, i) => `<div class="carousel-dot ${i === 0 ? 'active' : ''}" style="background: ${i === 0 ? typeColor : 'rgba(255,255,255,0.3)'};"></div>`).join("");
    return `<div class="carousel-wrapper">
              <div class="carousel-container" id="carousel-${typeId}" onscroll="updateCarouselDots('carousel-${typeId}', 'dots-${typeId}', '${typeColor}')">${slidesHtml}</div>
              <div class="carousel-dots" id="dots-${typeId}">${dotsHtml}</div>
            </div>`;
  }

  window.updateCarouselDots = function(containerId, dotsId, activeColor) {
    const container = document.getElementById(containerId); const dotsContainer = document.getElementById(dotsId);
    if (!container || !dotsContainer) return;
    const dots = dotsContainer.children;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    for (let i = 0; i < dots.length; i++) {
      if (i === index) { dots[i].classList.add('active'); if(activeColor) dots[i].style.background = activeColor; } 
      else { dots[i].classList.remove('active'); dots[i].style.background = 'rgba(255,255,255,0.3)'; }
    }
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array;
  }

  // Функція для фільтрації об'єктів за містом
  function isVilnohirsk(str) {
    if (!str) return false;
    const lower = String(str).toLowerCase();
    return lower.includes('вільногірськ') || lower.includes('вильногорск') || lower.includes('вільно') || lower.includes('вильно') || lower.includes('vilnohirsk');
  }

  async function loadAlerts() {
    try {
      const r = await fetch('https://vilnohirsk-alerts-production.up.railway.app/api/alert'); const d = await r.json();
      const communalAlerts = (d && Array.isArray(d.communal)) ? d.communal.filter(i => i && i.show) : [];
      const newsAlerts = (d && Array.isArray(d.news)) ? d.news.filter(i => i && i.show) : [];
      checkNotification('communal', communalAlerts); checkNotification('news', newsAlerts);
      document.getElementById("alert-communal-content").innerHTML = buildCarouselHtml(communalAlerts, '#ffcc00', 'communal');
      document.getElementById("alert-news-content").innerHTML = buildCarouselHtml(newsAlerts, '#00ff9c', 'news');
    } catch(e) {
      document.getElementById("alert-communal-content").innerHTML = `<div class="alert-empty">Помилка завантаження</div>`;
      document.getElementById("alert-news-content").innerHTML = `<div class="alert-empty">Помилка завантаження</div>`;
    }
  }

  async function loadEventsData() {
    try {
      const API_URL = `https://raw.githubusercontent.com/denris87/vilnohirsk-events/main/events.json?t=${new Date().getTime()}`;
      const r = await fetch(API_URL);
      if (!r.ok) throw new Error('Network error');
      const eventAlerts = await r.json();
      const activeEvents = Array.isArray(eventAlerts) ? eventAlerts.filter(i => i.show !== false) : [];
      checkNotification('events', activeEvents);
      window.currentEventImages = activeEvents.map(ev => ev.photo || ev.image || ev.url).filter(Boolean);
      document.getElementById("alert-events-content").innerHTML = buildCarouselHtml(activeEvents, '#FF3366', 'events', true);
    } catch(e) {
      document.getElementById("alert-events-content").innerHTML = `<div class="alert-empty" style="margin-bottom:15px;">Афіш поки немає</div>`;
    }
  }

  function renderShops(shopsData) {
    const container = document.getElementById('shopping-list-content');
    if (!shopsData || !Array.isArray(shopsData) || shopsData.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding: 20px; color: rgba(255,255,255,0.5);">Оголошень поки немає</div>'; return;
    }
    let html = '<div class="shops-tile-grid">';
    shopsData.forEach((shop, index) => {
      if(!shop) return;
      const safeName = shop.name != null ? String(shop.name).trim() : "";
      const displayName = safeName !== "" ? safeName : "Оголошення " + (index + 1);
      const detailsId = 'shop-detail-' + index;
      const isVip = shop.vip === true || shop.vip === 'true';
      const vipClass = isVip ? 'vip-tile' : '';
      const vipBadge = isVip ? '<div class="vip-badge">VIP</div>' : '';
      const safePhotoUrl = shop.photo != null && String(shop.photo).trim() !== "" ? String(shop.photo).trim() : null;
      
      // ГОЛОВНЕ ФОТО БЕЗ ЗУМУ
      const photoHtml = safePhotoUrl ? `<img src="${safePhotoUrl}" alt="${displayName}">` : `<span style="font-size:28px;">🛍️</span>`;
      
      const safeInsta = shop.instagram != null ? String(shop.instagram).trim() : "";
      const titleHtml = safeInsta !== "" ? `<a href="${safeInsta}" target="_blank" style="color:inherit; text-decoration:none;" onclick="event.stopPropagation();">${displayName} 🔗</a>` : displayName;
      const safeSchedule = shop.schedule != null ? String(shop.schedule).replace(/\n/g, '<br>') : 'Не вказано';
      let phoneHtml = 'Не вказано';
      if (shop.phone != null && String(shop.phone).trim() !== "") {
        const phonesArray = String(shop.phone).split(',').map(p => p.trim());
        phoneHtml = phonesArray.map(p => {
          const cleanNumber = p.replace(/[^0-9+]/g, '');
          return `<a href="tel:${cleanNumber}" class="shop-phone-link" onclick="event.stopPropagation();">${p}</a>`;
        }).join('<br>'); 
      }
      const safeCategory = shop.category != null && String(shop.category).trim() !== "" ? String(shop.category).trim() : "Магазин";
      const safeAddress = shop.address != null && String(shop.address).trim() !== "" ? String(shop.address).trim() : "Не вказано";
      const isContactless = shop.contactless === true || shop.contactless === 'true' || shop.contactless === '✅';

      html += `
        <div class="shop-tile ${vipClass}" onclick="toggleShop('${detailsId}', this)">
          ${vipBadge}
          <div class="shop-tile-photo">${photoHtml}</div>
          <div class="shop-tile-cat">${safeCategory}</div>
          <div class="shop-tile-name">${titleHtml}</div>
          <div class="shop-tile-chevron">Деталі ▾</div>
          <div class="shop-details-dropdown" id="${detailsId}" onclick="event.stopPropagation()">
            <div class="shop-inner-list">
              <div class="shop-inner-item"><span class="detail-icon">📍</span><div>Адреса:<br><b>${safeAddress}</b></div></div>
              <div class="shop-inner-item"><span class="detail-icon">🕒</span><div><b>Графік роботи:</b><br>${safeSchedule}</div></div>
              <div class="shop-inner-item"><span class="detail-icon">💳</span><div>Термінал: <b>${isContactless ? '✅' : '❌'}</b></div></div>
              <div class="shop-inner-item"><span class="detail-icon">📞</span><div>Телефон(и):<br>${phoneHtml}</div></div>
            </div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html + '</div>';
  }

  async function loadShopsData() {
    try {
      const r = await fetch('https://vilnohirsk-shops-production.up.railway.app/api/shops');
      if (!r.ok) throw new Error('Помилка HTTP');
      const d = await r.json();
      let itemsArray = d.shops || d.items || (Array.isArray(d) ? d : []);
      checkNotification('shopping', itemsArray);
      if (!itemsArray || itemsArray.length === 0) { document.getElementById('shopping-list-content').innerHTML = '<div style="text-align:center; padding: 20px; color: rgba(255,255,255,0.5);">Оголошень поки немає</div>'; return; }
      
      const activeShops = itemsArray.filter(shop => shop && shop.name && String(shop.name).trim() !== "");
      const vipShops = activeShops.filter(shop => shop.vip === true || shop.vip === 'true');
      const regularShops = activeShops.filter(shop => shop.vip !== true && shop.vip !== 'true');
      
      renderShops([...vipShops, ...shuffleArray([...regularShops])]);
    } catch(e) {
      console.error(e);
      document.getElementById('shopping-list-content').innerHTML = `<div style="text-align:center; padding: 20px; color: #ff6b6b; font-weight:600; font-size: 13px;">Помилка завантаження магазинів: ${e.message}</div>`;
    }
  }

  window.renderFleaMarketList = function(items) {
    const cont = document.getElementById('flea-market-list-content');
    if (!items || !items.length) { 
        cont.innerHTML = '<div style="text-align:center; padding:20px; opacity:0.5;">Оголошень у цій категорії немає</div>'; 
        return; 
    }
    
    let html = '<div class="shops-tile-grid">';
    items.forEach((item, i) => {
      const id = 'flea-detail-' + i;
      const thumb = item.photos.length > 0 ? `<img src="${item.photos[0]}">` : `<span style="font-size:28px;">📦</span>`;
      let priceText = item.price ? String(item.price).trim() : 'Ціна договірна';
      if (priceText !== "Ціна договірна" && !priceText.toLowerCase().includes("грн")) priceText += " грн";
      
      let allPhotosHtml = '';
      if (item.photos.length > 0) {
        const encodedPhotos = encodeURIComponent(JSON.stringify(item.photos));
        allPhotosHtml = `
          <div style="text-align:center; background:rgba(0,0,0,0.3); border-radius:8px; margin-bottom:10px; padding:5px; cursor:pointer;" onclick="openImageModal(JSON.parse(decodeURIComponent('${encodedPhotos}')), 0, event)">
            <img src="${item.photos[0]}" onload="if(window.recalcDropdownHeight) window.recalcDropdownHeight(this)" style="width:100%; max-height:250px; object-fit:contain; border-radius:6px;">
            <div style="font-size:10px; color:rgba(255,255,255,0.5); margin-top:4px; font-weight:700;">🔍 Галерея (${item.photos.length} фото)</div>
          </div>
        `;
      }

      const safeTitle = item.title;
      const safeCat = item.category;
      const safeCond = item.condition;
      const safeDesc = item.description.replace(/\n/g, '<br>');
      const safeLoc = item.location;
      const safePhone = item.phone;

      html += `
        <div class="shop-tile" onclick="toggleShop('${id}', this)">
          <div class="shop-tile-photo">${thumb}</div>
          <div class="shop-tile-cat">${safeCat}</div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:5px; gap:6px; width: 100%;">
             <span style="color:#00ff9c; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0; flex-shrink:0; max-width:45%; min-width:0; word-break: break-word; overflow-wrap: anywhere;">${priceText}</span>
             <span style="font-size:10px; color:rgba(255,255,255,0.6); font-weight:600; text-align:right; flex:1; min-width:0; word-break: break-word; overflow-wrap: anywhere;">📍 ${safeLoc}</span>
          </div>
          <div class="shop-tile-name">${safeTitle}</div>
          <div class="shop-tile-chevron">Опис ▾</div>
          <div class="shop-details-dropdown" id="${id}" onclick="event.stopPropagation()">
            <div class="shop-inner-list">
              ${allPhotosHtml}
              <div class="shop-inner-item"><span class="detail-icon">📌</span><div><b>Категорія:</b><br>${safeCat}</div></div>
              <div class="shop-inner-item"><span class="detail-icon">✨</span><div><b>Стан:</b><br>${safeCond}</div></div>
              <div class="shop-inner-item"><span class="detail-icon">📝</span><div><b>Опис:</b><br>${safeDesc}</div></div>
              <div class="shop-inner-item"><span class="detail-icon">📞</span><div><b>Контакти:</b><br><a href="tel:${safePhone.replace(/[^0-9+]/g, '')}" class="shop-phone-link">${safePhone}</a></div></div>
            </div>
          </div>
        </div>`;
    });
    cont.innerHTML = html + '</div>';
  };

  window.filterFleaMarket = function(category, element) {
    document.querySelectorAll('.flea-category-tag').forEach(tag => tag.classList.remove('active'));
    if(element) element.classList.add('active');

    if (category === 'Всі') {
      renderFleaMarketList(window.allFleaMarketItems);
    } else {
      const filtered = window.allFleaMarketItems.filter(item => {
        return item.category && (item.category === category || item.category.includes(category));
      });
      renderFleaMarketList(filtered);
    }
  };

  async function loadFleaMarketData() {
    try {
      const csvUrl = 'https://docs.google.com/spreadsheets/d/10MgSaPFFh0mDE094UkrG1BQwHabmGvSg124F5B4T1lg/gviz/tq?tqx=out:csv&gid=111977759';
      
      const response = await fetch(csvUrl);
      if (!response.ok) throw new Error("Не вдалося завантажити таблицю барахолки");
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const approvedItems = results.data.filter(row => {
            const keys = Object.keys(row);
            let status = row['Статус'] || row['Status'] || row['status'] || row[keys[keys.length - 1]];
            return status && String(status).trim().toLowerCase() === 'одобрено';
          }).map(row => {
            const keys = Object.keys(row);
            let rawPhoto = row['Фото (Тип запитання: Завантаження файлу)'] || row['Фото'] || row['photos'] || row['Photos'] || row[keys[5]] || '';
            let photoUrls = String(rawPhoto).split(',').map(p => p.trim()).filter(p => p);
            
            let processedPhotos = photoUrls.map(url => {
                let fileId = '';
                if (url.includes('id=')) fileId = url.split('id=')[1].split('&')[0];
                else if (url.includes('file/d/')) { let match = url.match(/\/d\/(.*?)\//); if (match && match[1]) fileId = match[1]; }
                return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000` : url;
            });

            return {
              title: row['Назва товару (Коротка відповідь)'] || row['Назва товару'] || row['Title'] || row['title'] || row[keys[1]] || 'Без назви',
              price: row['Ціна (Коротка відповідь)'] || row['Ціна'] || row['Price'] || row['price'] || row[keys[2]] || '',
              description: row['Опис (Абзац)'] || row['Опис'] || row['Description'] || row['description'] || row[keys[3]] || 'Без опису',
              phone: row['Телефон (Коротка відповідь)'] || row['Телефон'] || row['Phone'] || row['phone'] || row[keys[4]] || 'Не вказано',
              photos: processedPhotos, 
              category: row['Категорія товару'] || row['Категорія'] || row['Category'] || row['category'] || row[keys[6]] || 'Різне',
              condition: row['Стан товару'] || row['Стан'] || row['Condition'] || row['condition'] || row[keys[7]] || 'Не вказано',
              location: row['Місто/Область, де знаходиться товар'] || row['Місто'] || row['Location'] || row['location'] || row[keys[8]] || 'Вільногірськ'
            };
          });

          // ФІЛЬТР: Лишаємо тільки ті оголошення, де місто Вільногірськ
          const localItems = approvedItems.filter(item => isVilnohirsk(item.location));

          checkNotification('flea', localItems);
          
          window.allFleaMarketItems = localItems;
          
          const activeTag = document.querySelector('.flea-category-tag.active');
          const currentCategory = activeTag ? activeTag.innerText.trim() : 'Всі';
          
          if(currentCategory === 'Всі') {
              renderFleaMarketList(localItems);
          } else {
              filterFleaMarket(currentCategory, activeTag); 
          }
        }
      });
    } catch (e) {
      console.error("Помилка завантаження барахолки:", e);
      document.getElementById('flea-market-list-content').innerHTML = `<div style="text-align:center; padding:20px; color:#ff4d4d; font-size:12px;">Помилка: ${e.message}</div>`;
    }
  }

  async function loadLostFoundData() {
    try {
      const csvUrl = 'https://docs.google.com/spreadsheets/d/10MgSaPFFh0mDE094UkrG1BQwHabmGvSg124F5B4T1lg/gviz/tq?tqx=out:csv&gid=624471689';
      
      const response = await fetch(csvUrl);
      if (!response.ok) throw new Error("Не вдалося завантажити таблицю знахідок");
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const approvedItems = results.data.filter(row => {
            const keys = Object.keys(row);
            let status = row['Статус'] || row['Status'] || row['status'] || row[keys[keys.length - 1]];
            return status && String(status).trim().toLowerCase() === 'одобрено';
          }).map(row => {
            const keys = Object.keys(row);
            let rawPhoto = row['Додати фото'] || row['Photos'] || row['Фото'] || row['photos'] || row[keys[5]] || '';
            let photoUrls = String(rawPhoto).split(',').map(p => p.trim()).filter(p => p);
            let processedPhotos = photoUrls.map(url => {
                let fileId = '';
                if (url.includes('id=')) fileId = url.split('id=')[1].split('&')[0];
                else if (url.includes('file/d/')) { let match = url.match(/\/d\/(.*?)\//); if (match && match[1]) fileId = match[1]; }
                return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000` : url;
            });
            return {
              title: row['Назва речі'] || row['Title'] || row['title'] || row[keys[1]] || 'Без назви',
              type: row['Що сталося?'] || row['Type'] || row['Тип'] || row['type'] || row[keys[2]] || 'Знайдено',
              description: row['Опис та обставини'] || row['Description'] || row['Опис'] || row['description'] || row[keys[3]] || 'Без опису',
              phone: row['Ваш телефон'] || row['Phone'] || row['Телефон'] || row['phone'] || row[keys[4]] || 'Не вказано',
              photos: processedPhotos, 
              category: row['Категорія'] || row['Category'] || row['category'] || row[keys[6]] || 'Інше',
              location: row['Локація'] || row['Location'] || row['location'] || row[keys[7]] || 'Вільногірськ'
            };
          });

          // ФІЛЬТР: Лишаємо тільки ті оголошення, де місто Вільногірськ
          const localItems = approvedItems.filter(item => isVilnohirsk(item.location));

          checkNotification('lost', localItems);
          
          const cont = document.getElementById('lost-found-list-content');
          if (!localItems.length) { cont.innerHTML = '<div style="text-align:center; padding:20px; opacity:0.5;">Оголошень немає</div>'; return; }
          
          let html = '<div class="shops-tile-grid">';
          localItems.reverse().forEach((item, i) => {
            const id = 'lost-detail-' + i;
            const thumb = item.photos.length > 0 ? `<img src="${item.photos[0]}">` : `<span style="font-size:28px;">🔍</span>`;
            const badgeColor = item.type.toLowerCase().includes('знайдено') ? '#00ff9c' : '#ff4d4d';
            
            let allPhotosHtml = '';
            if (item.photos.length > 0) {
              const encodedPhotos = encodeURIComponent(JSON.stringify(item.photos));
              allPhotosHtml = `
                <div style="text-align:center; background:rgba(0,0,0,0.3); border-radius:8px; margin-bottom:10px; padding:5px; cursor:pointer;" onclick="openImageModal(JSON.parse(decodeURIComponent('${encodedPhotos}')), 0, event)">
                  <img src="${item.photos[0]}" onload="if(window.recalcDropdownHeight) window.recalcDropdownHeight(this)" style="width:100%; max-height:250px; object-fit:contain; border-radius:6px;">
                  <div style="font-size:10px; color:rgba(255,255,255,0.5); margin-top:4px; font-weight:700;">🔍 Галерея (${item.photos.length} фото)</div>
                </div>
              `;
            }

            const safeTitle = item.title;
            const safeDesc = item.description.replace(/\n/g, '<br>');
            const safeLoc = item.location;
            const safePhone = item.phone;

            html += `
              <div class="shop-tile" onclick="toggleShop('${id}', this)">
                <div class="shop-tile-photo">${thumb}</div>
                <div class="shop-tile-cat">${item.category}</div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:5px; gap:6px; width: 100%;">
                   <span style="color:${badgeColor}; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0; flex-shrink:0; max-width:45%; min-width:0; word-break: break-word; overflow-wrap: anywhere;">${item.type}</span>
                   <span style="font-size:10px; color:rgba(255,255,255,0.6); font-weight:600; text-align:right; flex:1; min-width:0; word-break: break-word; overflow-wrap: anywhere;">📍 ${safeLoc}</span>
                </div>
                <div class="shop-tile-name">${safeTitle}</div>
                <div class="shop-tile-chevron">Опис ▾</div>
                <div class="shop-details-dropdown" id="${id}" onclick="event.stopPropagation()">
                  <div class="shop-inner-list">
                    ${allPhotosHtml}
                    <div class="shop-inner-item"><span class="detail-icon">📌</span><div><b>Категорія:</b><br>${item.category}</div></div>
                    <div class="shop-inner-item"><span class="detail-icon">📝</span><div><b>Опис:</b><br>${safeDesc}</div></div>
                    <div class="shop-inner-item"><span class="detail-icon">📞</span><div><b>Контакти:</b><br><a href="tel:${safePhone.replace(/[^0-9+]/g, '')}" class="shop-phone-link">${safePhone}</a></div></div>
                  </div>
                </div>
              </div>`;
          });
          cont.innerHTML = html + '</div>';
        }
      });
    } catch (e) {
      console.error("Помилка завантаження знахідок:", e);
      document.getElementById('lost-found-list-content').innerHTML = `<div style="text-align:center; padding:20px; color:#ff4d4d; font-size:12px;">Помилка: ${e.message}</div>`;
    }
  }

  function isPast(timeStr) {
    if (!timeStr || !timeStr.includes(":")) return false;
    const now = getKyivNow(); const [h, m] = timeStr.split(":").map(Number);
    const t = new Date(now); t.setHours(h, m, 0, 0); return t < now;
  }

  function renderGrid(data, isChanges = false, alwaysWhite = false) {
    if (!data || data.length === 0) return "";
    const total = data.length; const perCol = Math.ceil(total / 3);
    let html = '<div class="schedule-grid">';
    for(let c = 0; c < 3; c++) {
      html += '<div class="schedule-column">';
      for(let j = 0; j < perCol; j++) {
        const idx = c * perCol + j;
        if (idx < total) {
          const r = data[idx]; const past = isPast(r[1]);
          const isVil = (r[0] || "").toLowerCase().includes('вільногірськ');
          const rowClass = isVil ? 'schedule-row row-highlight' : 'schedule-row';
          let timeClass = (alwaysWhite || isChanges) ? 'time-normal' : (past ? 'time-passed' : 'time-green');
          html += `<div class="${rowClass}"><div class="schedule-left"><span class="station-number">${idx + 1}.</span><span class="station-name-text">${r[0]}</span></div><div class="${timeClass}">${r[1]}</div></div>`;
        }
      }
      html += '</div>';
    }
    return html + '</div>';
  }

  function loadTrainsData(){ 
    fetch("https://vilnohirsk-trains-production.up.railway.app/api/trains").then(r=>r.json()).then(d=>{
      if(d&&d.trains) {
        let h = `<div class="table-head"><div>№</div><div>Маршрут</div><div>Відпр.</div></div><div id="trains-content">`;
        d.trains.forEach(x => {
          if (!x) return; const id = "d-" + x.number; const now = getKyivNow(); let sc = "future", dt = x.time;
          if (x.time && x.time.includes(':')) {
            const [hh, mm] = x.time.split(':').map(Number); const tt = new Date(now); tt.setHours(hh, mm, 0, 0);
            const diff = Math.floor((tt - now) / 60000);
            if (diff < 0) sc = "passed"; else if (diff <= 10) { sc = "soon"; dt = `≈ ${diff} хв`; }
          } else sc = "passed";
          const hc = x.note && x.note !== "змін немає...";
          h += `<div class="train" onclick="document.getElementById('${id}').classList.toggle('open')"><div class="train-num-box">${x.number}${hc ? '<span class="train-alert-dot"></span>' : ''}</div><div class="route-text">${x.route}</div><div class="time-val ${sc}">${dt}</div></div><div class="details" id="${id}">${x.fullSchedule ? renderGrid(x.fullSchedule) : "Немає даних"}${hc ? `<div class="details-divider"></div><div class="details-note">${x.note}</div>` : ''}${x.altSchedule ? renderGrid(x.altSchedule, true) : ""}</div>`;
        });
        document.getElementById("list").innerHTML = h + `</div>`;
        const changed = d.trains.filter(x => x && x.note && x.note !== "змін немає...");
        if (changed.length > 0) checkNotification('trains', changed); else { const dot = document.getElementById('dot-trains'); if (dot) dot.style.display = 'none'; }
      }
    }).catch(e=>document.getElementById("list").innerHTML="<div style='text-align:center; padding: 20px;'>Помилка завантаження</div>"); 
  }
  
  function loadLongTrainsData() { 
    fetch("https://grateful-enthusiasm-production-c1cc.up.railway.app/schedule").then(r=>r.json()).then(d=>{
      if(d&&d.trains) {
        let h = `<div class="table-head"><div>№</div><div>Маршрут</div><div>Відпр.</div></div>`;
        d.trains.forEach((x,i) => {
          if(!x) return; const id = "lt-" + i; 
          const sm = x.stops ? x.stops.map(s => [s.station, s.time]) : [];
          const hasChanges = x.changes && Array.isArray(x.changes) && x.changes.length > 0;
          let infoHtml = "";
          if (x.periodicityText) infoHtml += `<div class="details-divider"></div><div class="details-note" style="color: #74b9ff; background: rgba(116, 185, 255, 0.1); border-color: rgba(116, 185, 255, 0.15);"><b>Періодичність:</b><br><span style="color:rgba(255,255,255,0.7); font-weight:500;">${x.periodicityText}</span></div>`;
          if (hasChanges) infoHtml += `<div class="details-divider"></div><div class="details-note" style="color: var(--highlight-color); background: rgba(255, 204, 0, 0.1); border-color: rgba(255, 204, 0, 0.15);"><b>Зміни розкладу:</b><ul style="margin: 8px 0 0 0; padding-left: 20px; text-align: left; font-weight: 500; color: rgba(255,255,255,0.8);">${x.changes.map(c => `<li>${c}</li>`).join('')}</ul></div>`;

          h += `<div class="train" onclick="document.getElementById('${id}').classList.toggle('open')"><div class="train-num-box">${x.number}</div><div class="route-text">${x.route}</div><div class="time-val" style="color:#fff;">${x.time}</div></div><div class="details" id="${id}">${sm.length ? renderGrid(sm, false, true) : "Немає даних"}${infoHtml}</div>`;
        });
        document.getElementById("long-trains-list").innerHTML = h;
      }
    }).catch(e=>{}); 
  }

  function loadBusesData(){ 
    fetch("https://vilnohirskbuses-production.up.railway.app/api/buses").then(r=>r.json()).then(d=>{
      if(d&&d.buses) {
        let h = `<div class="table-head"><div>Тип</div><div>Маршрут</div><div>Статус</div></div>`;
        d.buses.forEach((b,i) => {
          if(!b) return; const id = "bus-" + i; let ch = '';
          if(b.directions) b.directions.forEach(dir => {
            let rh = dir.rows.map(row => `<div class="schedule-row"><div class="schedule-left"><span class="station-name-text">${row[0]}</span></div><div class="time-normal">${row[1]}</div></div>`).join('');
            ch += `<div class="schedule-column"><div style="text-align:center; color:var(--highlight-color); font-size:11px; margin-bottom:10px; font-weight:800; text-transform:uppercase;">${dir.title}</div>${rh}</div>`;
          });
          
          let extraInfo = '';
          if (b.note) extraInfo += `<div class="details-divider"></div><div class="details-note">${b.note}</div>`;
          if (b.info) extraInfo += `<div class="details-divider"></div><div class="details-note" style="color: #74b9ff; background: rgba(116, 185, 255, 0.1); border-color: rgba(116, 185, 255, 0.15);">${b.info}</div>`;

          h += `<div class="train" onclick="document.getElementById('${id}').classList.toggle('open')"><div class="train-num-box" style="background:transparent; font-size:20px;">🚌</div><div class="route-text">${b.route}</div><div class="time-val future" style="font-size:11px;">Розклад ▾</div></div><div class="details" id="${id}"><div class="bus-grid">${ch}</div>${extraInfo}</div>`;
        });
        document.getElementById("buses-list").innerHTML = h;
      }
    }).catch(e=>{}); 
  }

  async function loadBlaBlaCarData() {
    try {
      const r = await fetch('https://vilnohirsk-blablacar-api-production-67d3.up.railway.app/api/rides');
      const d = await r.json(); checkNotification('blablacar', d);
      
      const dr = d.filter(x => x.type === 'driver' && (isVilnohirsk(x.from) || isVilnohirsk(x.to)));
      const ps = d.filter(x => x.type === 'passenger' && (isVilnohirsk(x.from) || isVilnohirsk(x.to)));
      
      document.getElementById('blabla-drivers-list').innerHTML = dr.length ? dr.map(x => `
        <div class="blabla-card">
          <div class="blabla-route">📍 ${x.from} - ${x.to}</div>
          <div class="blabla-date">🗓 ${x.date} | 🕒 ${x.time}</div>
          <div style="font-size:12px; margin-bottom:5px;">👤 <b>${x.name}</b></div>
          <div class="blabla-info-row"><span>💺 Місць: <b>${x.seats}</b></span><span>💵 <b>${x.price > 0 ? x.price + ' грн' : 'Договірна'}</b></span></div>
          ${x.comment ? `<div style="font-size:11px; opacity:0.8; margin-top:5px; min-width:0; word-break:break-word; overflow-wrap:anywhere;">💬 ${x.comment}</div>` : ''}
          <div style="text-align:right; margin-top:5px;"><a href="tel:${x.phone}" class="blabla-phone">📞 ${x.phone}</a></div>
        </div>`).join('') : '<div style="text-align:center; padding:20px; opacity:0.5;">Пропозицій немає</div>';
        
      document.getElementById('blabla-passengers-list').innerHTML = ps.length ? ps.map(x => `
        <div class="blabla-card">
          <div class="blabla-route">📍 ${x.from} - ${x.to}</div>
          <div class="blabla-date">🗓 ${x.date} | 🕒 ${x.time}</div>
          <div style="font-size:12px; margin-bottom:5px;">👤 <b>${x.name}</b></div>
          <div class="blabla-info-row"><span>🧍 Потрібно місць: <b>${x.seats}</b></span></div>
          ${x.comment ? `<div style="font-size:11px; opacity:0.8; margin-top:5px; min-width:0; word-break:break-word; overflow-wrap:anywhere;">💬 ${x.comment}</div>` : ''}
          <div style="text-align:right; margin-top:5px;"><a href="tel:${x.phone}" class="blabla-phone">📞 ${x.phone}</a></div>
        </div>`).join('') : '<div style="text-align:center; padding:20px; opacity:0.5;">Запитів немає</div>';
    } catch(e) {}
  }

  async function loadJobsData() {
    const container = document.getElementById('jobs-list-content');
    let allJobs = [];

    // 1. Завантажуємо вакансії з парсера (Railway)
    try {
      const r = await fetch('https://vilnohirsk-jobs-api-production.up.railway.app/api/jobs');
      if (r.ok) {
        const parsedJobs = await r.json();
        if (Array.isArray(parsedJobs)) {
          allJobs = allJobs.concat(parsedJobs);
        }
      }
    } catch(e) {
      console.log("Парсер вакансій поки недоступний");
    }

    // 2. Завантажуємо користувацькі вакансії з Google Таблиці
    const SHEET_GID = '1809375718'; 
    
    const csvUrl = `https://docs.google.com/spreadsheets/d/10MgSaPFFh0mDE094UkrG1BQwHabmGvSg124F5B4T1lg/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;
    
    try {
      const response = await fetch(csvUrl);
      if (response.ok) {
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: function(results) {
            const userJobs = results.data.filter(row => {
              // Берем только одобренные вакансии
              const keys = Object.keys(row);
              let status = row['Статус'] || row['Status'] || row['status'] || row[keys[1]];
              return status && String(status).trim().toLowerCase() === 'одобрено';
            }).map(row => {
              const keys = Object.keys(row);
              const phone = row['Телефон'] || row[keys[6]] || '';
              const gender = row['Стать'] || row['gender'] || row[keys[7]] || '';
              const employment = row['Зайнятість'] || row['employment'] || row[keys[8]] || '';
              
              // ПЕРЕВІРЯЄМО, ЧИ Є ВІДМІТКА VIP 
              const vipStatus = row['VIP'] || row[keys[9]] || '';
              const isVip = vipStatus.trim().toLowerCase() === 'так' || vipStatus.trim() === '+';

              return {
                title: row['Посада'] || row[keys[2]] || 'Без назви',
                salary: row['Зарплата'] || row[keys[3]] || '-',
                company: row['Компанія'] || row[keys[4]] || 'Не вказано',
                description: row['Опис'] || row[keys[5]] || '',
                date: row['Дата'] ? String(row['Дата']).split(' ')[0] : 'Нещодавно',
                phone: phone,
                gender: gender,
                employment: employment,
                url: phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : '#',
                isVip: isVip 
              };
            });
            
            allJobs = allJobs.concat(userJobs);
            renderJobs(allJobs);
          }
        });
      } else {
        renderJobs(allJobs); 
      }
    } catch (e) {
      console.error("Помилка завантаження таблиці вакансій:", e);
      renderJobs(allJobs);
    }
  }

  function renderJobs(jobs, isDemo = false) {
    const container = document.getElementById('jobs-list-content');
    if (!container) return;
    if (!jobs || jobs.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:20px; opacity:0.5;">Актуальних вакансій немає</div>';
      return;
    }
    
    let html = isDemo ? '<div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 10px; color: #ffcc00; font-size: 12px; font-weight: 700; text-align: center; margin-bottom: 15px;">⚠️ Демонстраційний режим (Бекенд у розробці)</div>' : '';
    
    // РОЗДІЛЯЄМО МАСИВ НА ТРИ КАТЕГОРІЇ
    const vipJobs = jobs.filter(j => j.isVip || j.vip).reverse();
    const internetJobs = jobs.filter(j => !j.isVip && !j.vip && (j.date === 'Work.ua' || j.date === 'Robota.ua'));
    const regularJobs = jobs.filter(j => !j.isVip && !j.vip && j.date !== 'Work.ua' && j.date !== 'Robota.ua');
    
    // Функція генерації однієї картки
    function createJobCardHtml(job, extraClass = '') {
      const isTel = job.url && job.url.startsWith('tel:');
      
      let displayPhone = job.phone;
      if (displayPhone) {
          let cleanPhone = displayPhone.replace(/\D/g, ''); 
          if (cleanPhone.length >= 10) displayPhone = '0' + cleanPhone.slice(-9);
          else if (cleanPhone.length === 9) displayPhone = '0' + cleanPhone;
      }

      const btnText = isTel && displayPhone ? displayPhone : (isTel ? 'Зателефонувати' : 'Деталі 🔗');
      const targetAttr = isTel ? '_self' : '_blank'; 
      
      let displaySalary = job.salary;
      if (displaySalary && displaySalary !== '-' && /^\d+$/.test(displaySalary.trim())) {
          displaySalary = displaySalary.trim() + ' грн';
      }

      const isVip = job.isVip || job.vip;
      const vipBadge = isVip ? '<div style="position:absolute; top:-8px; right:-8px; background:linear-gradient(135deg, #ffcc00, #ff8800); color:#000; font-size:10px; font-weight:900; padding:4px 8px; border-radius:12px; box-shadow:0 4px 10px rgba(255,204,0,0.4); text-transform:uppercase; letter-spacing:1px; z-index:10; animation:vipPulse 2s infinite;">VIP</div>' : '';
      const vipClass = isVip ? 'vip-job-card' : '';
      const bgStyle = isVip ? '' : 'background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);';
      
      let safeDesc = job.description || '';
      if (safeDesc.length > 200) safeDesc = safeDesc.substring(0, 200) + '...';
      safeDesc = safeDesc.replace(/\n/g, '<br>');
      
      let tagsHtml = '';
      if (job.employment || (job.gender && job.gender !== 'Не має значення' && job.gender !== 'Будь-яка')) {
        tagsHtml = '<div style="display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap;">';
        if (job.employment) tagsHtml += `<span style="background: rgba(255,255,255,0.08); padding: 4px 8px; border-radius: 8px; font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.7);">🕒 ${job.employment}</span>`;
        if (job.gender && job.gender !== 'Не має значення' && job.gender !== 'Будь-яка') tagsHtml += `<span style="background: rgba(255,255,255,0.08); padding: 4px 8px; border-radius: 8px; font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.7);">👤 ${job.gender}</span>`;
        tagsHtml += '</div>';
      }

      return `
        <div class="blabla-card ${vipClass} ${extraClass}" style="position: relative; text-align: left; ${bgStyle} border-radius: 16px; padding: 16px; display: flex; flex-direction: column; min-width: 0; overflow: visible; box-sizing: border-box;">
          ${vipBadge}
          <div style="font-size: 15px; font-weight: 800; color: #ffffff; margin-bottom: 6px; line-height: 1.3; min-width: 0; word-break: break-word; overflow-wrap: anywhere;">${job.title}</div>
          <div style="font-size: 14px; font-weight: 800; color: #00ff9c; margin-bottom: 12px; min-width: 0; word-break: break-word; overflow-wrap: anywhere;">${displaySalary}</div>
          <div style="font-size: 12px; color: #ffcc00; font-weight: 700; margin-bottom: 8px; min-width: 0; word-break: break-word; overflow-wrap: anywhere;">🏢 ${job.company}</div>
          ${tagsHtml}
          <div style="font-size: 12px; color: rgba(255,255,255,0.8); line-height: 1.5; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; min-width: 0; word-break: break-word; overflow-wrap: anywhere;">${safeDesc}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; min-width: 0; gap: 8px; margin-top: auto;">
             <div style="font-size: 11px; color: rgba(255,255,255,0.5); flex-shrink: 0;">📆 ${job.date}</div>
             <div style="font-size: 11px; font-weight: bold; color: #74b9ff; background: rgba(116, 185, 255, 0.05); border: 1px solid rgba(116, 185, 255, 0.1); padding: 6px 14px; border-radius: 12px; transition: background 0.3s; white-space: nowrap; cursor: pointer; flex-shrink: 0;" onclick="window.open('${job.url}', '${targetAttr}'); event.stopPropagation();">${btnText}</div>
          </div>
        </div>
      `;
    }

    // 1. VIP Вакансії
    if (vipJobs.length > 0) {
        html += '<div class="jobs-grid">';
        vipJobs.forEach(job => { html += createJobCardHtml(job); });
        html += '</div>';
    }

    // Лінія-розділювач 1
    if (vipJobs.length > 0 && (internetJobs.length > 0 || regularJobs.length > 0)) {
        html += '<div class="section-divider"></div>';
    }

    // 2. Інтернет вакансії (Карусель)
    if (internetJobs.length > 0) {
        html += '<div style="font-size:11px; color:var(--time-green); text-transform:uppercase; font-weight:800; margin-bottom:10px; text-align:left; padding-left:5px; letter-spacing: 0.5px;">🌐 Знайдено в інтернеті</div>';
        html += '<div class="jobs-carousel">';
        internetJobs.forEach(job => { html += createJobCardHtml(job, 'jobs-carousel-card'); });
        html += '</div>';
    }

    // Лінія-розділювач 2
    if (internetJobs.length > 0 && regularJobs.length > 0) {
        html += '<div class="section-divider"></div>';
    }

    // 3. Звичайні вакансії (Міксер)
    if (regularJobs.length > 0) {
        html += '<div style="font-size:11px; color:var(--highlight-color); text-transform:uppercase; font-weight:800; margin-bottom:10px; text-align:left; padding-left:5px; letter-spacing: 0.5px;">👥 Від місцевих жителів</div>';
        html += '<div class="jobs-grid">';
        shuffleArray(regularJobs).forEach(job => { html += createJobCardHtml(job); });
        html += '</div>';
    }

    container.innerHTML = html;
  }

  window.onload = () => {
    updateDateTime(); 
    loadWeather(); 
    loadAlerts(); 
    loadEventsData(); 
    loadTrainsData(); 
    loadLongTrainsData(); 
    loadBusesData(); 
    loadShopsData(); 
    loadFleaMarketData(); 
    loadLostFoundData(); 
    loadBlaBlaCarData(); 
    loadJobsData();
    setInterval(updateDateTime, 1000); 
    setInterval(() => { loadTrainsData(); loadLongTrainsData(); loadAlerts(); loadEventsData(); loadShopsData(); loadFleaMarketData(); loadLostFoundData(); loadBlaBlaCarData(); loadJobsData(); }, 30000);

    document.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('focus', function() { setTimeout(() => { this.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 300); });
    });
  };
}
</script>
</body>
</html>
