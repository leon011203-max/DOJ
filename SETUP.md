# FiveM Revive Bot - Setup Anleitung

Dieses System besteht aus zwei Teilen:
1. **Discord Bot** - Verarbeitet den `/revive` Command
2. **FiveM Resource** - Belebt Spieler auf dem Server wieder

---

## 📋 Voraussetzungen

### Für den Discord Bot:
- Node.js (Version 16 oder höher) - [Download](https://nodejs.org/)
- Ein Discord Bot Token - [Anleitung](#discord-bot-erstellen)
- Deine Discord Server ID (Guild ID)
- Die Role ID der Rolle, die den Command nutzen darf

### Für das FiveM Resource:
- Ein FiveM Server mit txAdmin
- Zugriff auf den Server-Ordner
- HTTP-Zugriff auf den Server (Port freigeben)

---

## 🤖 Teil 1: Discord Bot Setup

### Schritt 1: Discord Bot erstellen

1. Gehe zu [Discord Developer Portal](https://discord.com/developers/applications)
2. Klicke auf "New Application"
3. Gib einen Namen ein (z.B. "Revive Bot")
4. Gehe zu "Bot" im linken Menü
5. Klicke auf "Add Bot"
6. Aktiviere folgende Privileged Gateway Intents:
   - `PRESENCE INTENT`
   - `SERVER MEMBERS INTENT`
   - `MESSAGE CONTENT INTENT`
7. Klicke auf "Reset Token" und kopiere den Token (DEN TOKEN GEHEIM HALTEN!)

### Schritt 2: Bot einladen

1. Gehe zu "OAuth2" → "URL Generator"
2. Wähle unter "Scopes":
   - `bot`
   - `applications.commands`
3. Wähle unter "Bot Permissions":
   - `Send Messages`
   - `Use Slash Commands`
4. Kopiere die generierte URL und öffne sie im Browser
5. Wähle deinen Server aus und bestätige

### Schritt 3: IDs sammeln

#### Discord Server ID (Guild ID):
1. Aktiviere den Entwicklermodus in Discord: Einstellungen → App-Einstellungen → Erweitert → Entwicklermodus
2. Rechtsklick auf deinen Server → "Server-ID kopieren"

#### Client ID (Application ID):
1. Gehe zum [Discord Developer Portal](https://discord.com/developers/applications)
2. Wähle deine Application aus
3. Kopiere die "Application ID" auf der General Information Seite

#### Role ID:
1. Gehe zu deinem Discord Server
2. Server Einstellungen → Rollen
3. Rechtsklick auf die Rolle, die den Revive Command nutzen darf → "Rollen-ID kopieren"

### Schritt 4: Bot konfigurieren

1. Öffne den Ordner `discord-bot`
2. Kopiere `.env.example` zu `.env`:
   ```bash
   cp .env.example .env
   ```
3. Öffne `.env` und fülle die Werte aus:
   ```env
   DISCORD_TOKEN=dein_bot_token_hier
   CLIENT_ID=deine_application_id_hier
   GUILD_ID=deine_server_id_hier
   REVIVE_ROLE_ID=deine_rollen_id_hier

   FIVEM_SERVER_IP=127.0.0.1
   FIVEM_SERVER_PORT=30120
   FIVEM_API_KEY=ein_sicheres_passwort_hier
   ```

   **Wichtig:**
   - `FIVEM_SERVER_IP`: Die IP deines FiveM Servers (127.0.0.1 wenn auf demselben Server)
   - `FIVEM_API_KEY`: Wähle ein sicheres Passwort (muss mit FiveM config.lua übereinstimmen!)

### Schritt 5: Dependencies installieren

Öffne ein Terminal im `discord-bot` Ordner:

```bash
npm install
```

### Schritt 6: Commands registrieren

```bash
npm run deploy
```

Du solltest sehen: `✅ 1 Slash Command(s) erfolgreich registriert!`

### Schritt 7: Bot starten

```bash
npm start
```

Der Bot sollte jetzt online sein! Du siehst: `✅ Bot ist online als YourBotName#1234`

---

## 🎮 Teil 2: FiveM Resource Setup

### Schritt 1: Resource hochladen

1. Öffne deinen FiveM Server Ordner
2. Navigiere zu `resources/`
3. Erstelle einen neuen Ordner: `revive-bot` oder `[discord-integration]/revive-bot`
4. Kopiere alle Dateien aus dem `fivem-resource` Ordner in diesen Ordner:
   - `fxmanifest.lua`
   - `config.lua`
   - `server.lua`

### Schritt 2: Config anpassen

Öffne `config.lua` und passe folgende Werte an:

```lua
-- API Key (MUSS mit dem Discord Bot .env übereinstimmen!)
Config.ApiKey = "ein_sicheres_passwort_hier"
```

**Optional:** Passe weitere Einstellungen an:
- `healPlayer`: Spieler nach Revive heilen?
- `health`: Gesundheit nach Revive (200 = voll)
- `armor`: Armor nach Revive
- `showNotification`: Nachricht an Spieler zeigen?
- `reviveCoords`: Spieler zu bestimmten Koordinaten teleportieren

### Schritt 3: Resource starten

#### Option A: In server.cfg hinzufügen

Öffne deine `server.cfg` und füge hinzu:

```cfg
ensure revive-bot
```

oder wenn in Unterordner:

```cfg
ensure [discord-integration]/revive-bot
```

#### Option B: txAdmin

1. Öffne txAdmin
2. Gehe zu "Resources"
3. Finde "revive-bot"
4. Klicke auf "Start"

### Schritt 4: Server neustarten

Starte deinen FiveM Server neu. In der Console solltest du sehen:

```
========================================
[FiveM Revive Bot] Resource gestartet
[INFO] Discord Bot Integration aktiv
[INFO] Endpoint: /revive
========================================
```

---

## 🔒 Firewall / Port Freigabe

Damit der Discord Bot mit dem FiveM Server kommunizieren kann, muss der Port freigegeben werden.

### Windows Firewall:

```powershell
New-NetFirewallRule -DisplayName "FiveM HTTP" -Direction Inbound -LocalPort 30120 -Protocol TCP -Action Allow
```

### Linux (UFW):

```bash
sudo ufw allow 30120/tcp
```

### Linux (iptables):

```bash
sudo iptables -A INPUT -p tcp --dport 30120 -j ACCEPT
sudo iptables-save
```

**Wichtig:** Wenn dein FiveM Server hinter einem Router ist, musst du Port-Forwarding einrichten!

---

## ✅ Testen

### 1. Bot Status prüfen

Im Discord sollte der Bot als "Online" angezeigt werden.

### 2. Command testen

1. Gehe zu deinem Discord Server
2. Tippe `/revive` in einen Channel
3. Wähle eine Spieler-ID (z.B. 1)
4. Drücke Enter

**Erwartetes Ergebnis:**
- Bot antwortet mit: `✅ Spieler 1 wurde erfolgreich wiederbelebt!`
- Der Spieler auf dem FiveM Server wird wiederbelebt
- In der FiveM Server Console erscheint: `[REVIVE] Spieler Name (ID: 1) wurde wiederbelebt`

### 3. Berechtigungen testen

1. Entferne deine Rolle temporär
2. Versuche `/revive` auszuführen
3. Du solltest sehen: `❌ Du hast keine Berechtigung diesen Command zu nutzen!`

---

## 🐛 Fehlerbehebung

### Bot startet nicht:

**Fehler:** `Error: Invalid token`
- **Lösung:** Überprüfe deinen `DISCORD_TOKEN` in der `.env` Datei

**Fehler:** `NODE_MODULE not found`
- **Lösung:** Führe `npm install` aus

### Commands erscheinen nicht:

- Warte 5 Minuten (Discord Cache)
- Führe `npm run deploy` erneut aus
- Überprüfe ob `GUILD_ID` und `CLIENT_ID` korrekt sind
- Starte Discord neu (Strg+R)

### FiveM Server antwortet nicht:

**Fehler:** `❌ FiveM Server ist offline oder nicht erreichbar!`

**Ursachen:**
1. Resource nicht gestartet → Prüfe txAdmin oder Console
2. Port nicht freigegeben → Siehe [Firewall / Port Freigabe](#-firewall--port-freigabe)
3. Falsche IP/Port in `.env` → Überprüfe `FIVEM_SERVER_IP` und `FIVEM_SERVER_PORT`
4. API Key stimmt nicht überein → Gleiche `.env` und `config.lua` ab

**Test:** Öffne Browser und gehe zu `http://DEINE_SERVER_IP:30120`
- Wenn eine Fehlermeldung kommt → Server ist erreichbar ✅
- Wenn "Verbindung fehlgeschlagen" → Server nicht erreichbar ❌

### Spieler wird nicht wiederbelebt:

1. Überprüfe ob die Spieler-ID korrekt ist (in F8 Console: `/id` eingeben)
2. Prüfe ob dein Framework (ESX/QBCore/vRP) unterstützt wird
3. Schau in die FiveM Server Logs für Fehlermeldungen

---

## 🔧 Erweiterte Konfiguration

### Bot automatisch starten (Linux):

Erstelle einen systemd Service:

```bash
sudo nano /etc/systemd/system/revive-bot.service
```

Inhalt:

```ini
[Unit]
Description=FiveM Revive Discord Bot
After=network.target

[Service]
Type=simple
User=dein_username
WorkingDirectory=/pfad/zum/discord-bot
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Aktivieren:

```bash
sudo systemctl enable revive-bot
sudo systemctl start revive-bot
sudo systemctl status revive-bot
```

### Mehrere Server:

Du kannst einen Discord Bot für mehrere FiveM Server verwenden. Erstelle einfach mehrere Commands (z.B. `/revive-server1`, `/revive-server2`) mit verschiedenen Server-IPs.

---

## 📝 Support

Bei Problemen:
1. Überprüfe die Console-Ausgaben (Discord Bot & FiveM Server)
2. Stelle sicher, dass alle IDs und Tokens korrekt sind
3. Teste die Verbindung mit `curl`:
   ```bash
   curl -X POST http://DEINE_IP:30120/revive \
     -H "Content-Type: application/json" \
     -d '{"playerId": 1, "apiKey": "dein_api_key"}'
   ```

---

## 🎉 Fertig!

Dein Revive Bot ist jetzt einsatzbereit! Die Admins mit der konfigurierten Rolle können jetzt Spieler mit `/revive [ID]` wiederbeleben.

**Viel Erfolg! 🚀**
