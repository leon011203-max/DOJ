# FiveM Revive Discord Bot 🚑

Ein Discord Bot der es ermöglicht, Spieler auf einem FiveM Server mit dem `/revive [ID]` Command wiederzubeleben. Nur Benutzer mit einer bestimmten Discord-Rolle können diesen Command ausführen.

## ✨ Features

- 🎮 **Discord Slash Command**: `/revive [ID]` - Spieler wiederbeleben
- 🔒 **Rollen-basierte Berechtigungen**: Nur bestimmte Rollen können den Command nutzen
- 🔗 **FiveM Integration**: Direkte Kommunikation mit dem FiveM Server
- 🛡️ **Sicher**: API-Key Authentifizierung zwischen Bot und Server
- 📊 **Logging**: Vollständige Logs für alle Revive-Aktionen
- ⚙️ **Konfigurierbar**: Einfache Anpassung über Config-Dateien
- 🌍 **Framework-Support**: Funktioniert mit ESX, QBCore, vRP und Vanilla FiveM

## 📁 Projektstruktur

```
DOJ/
├── discord-bot/           # Discord Bot (Node.js)
│   ├── commands/
│   │   └── revive.js     # Revive Command
│   ├── index.js          # Bot Hauptdatei
│   ├── deploy-commands.js # Command Registrierung
│   ├── config.json       # Bot Konfiguration
│   ├── .env.example      # Umgebungsvariablen Vorlage
│   └── package.json      # Dependencies
│
├── fivem-resource/        # FiveM Server Resource
│   ├── fxmanifest.lua    # Resource Manifest
│   ├── config.lua        # Server Konfiguration
│   └── server.lua        # Server-seitiger Code
│
├── README.md             # Diese Datei
└── SETUP.md              # Detaillierte Setup-Anleitung
```

## 🚀 Schnellstart

### 1. Discord Bot einrichten

```bash
cd discord-bot
npm install
cp .env.example .env
# Bearbeite .env mit deinen Werten
npm run deploy
npm start
```

### 2. FiveM Resource installieren

1. Kopiere `fivem-resource` nach `resources/revive-bot`
2. Bearbeite `config.lua` mit deinem API-Key
3. Füge `ensure revive-bot` zu `server.cfg` hinzu
4. Starte den Server neu

### 3. Verwendung

Im Discord:
```
/revive 1
```

## 📖 Dokumentation

Eine **detaillierte Setup-Anleitung** findest du hier: [SETUP.md](SETUP.md)

Die Anleitung enthält:
- ✅ Schritt-für-Schritt Anweisungen
- ✅ Discord Bot Erstellung
- ✅ FiveM Resource Installation
- ✅ Firewall / Port Konfiguration
- ✅ Fehlerbehebung
- ✅ Erweiterte Konfiguration

## 🔧 Konfiguration

### Discord Bot (.env)

```env
DISCORD_TOKEN=dein_bot_token
CLIENT_ID=deine_client_id
GUILD_ID=deine_server_id
REVIVE_ROLE_ID=deine_rollen_id

FIVEM_SERVER_IP=127.0.0.1
FIVEM_SERVER_PORT=30120
FIVEM_API_KEY=dein_sicheres_passwort
```

### FiveM Resource (config.lua)

```lua
Config.ApiKey = "dein_sicheres_passwort"

Config.ReviveSettings = {
    healPlayer = true,
    health = 200,
    armor = 0,
    showNotification = true,
    logToConsole = true
}
```

## 🛡️ Sicherheit

- ✅ API-Key Authentifizierung
- ✅ Rollen-basierte Discord-Berechtigungen
- ✅ Optional: IP-Whitelist
- ✅ Request-Validierung
- ✅ Vollständiges Logging

**WICHTIG:** Halte deinen Discord Token und API-Key geheim!

## 📦 Requirements

### Discord Bot:
- Node.js 16+
- npm oder yarn

### FiveM Server:
- FiveM Server (txAdmin empfohlen)
- HTTP-Zugriff (Port 30120)

## 🤝 Support

Bei Problemen siehe [SETUP.md - Fehlerbehebung](SETUP.md#-fehlerbehebung)

## 📄 Lizenz

MIT License - Siehe [LICENSE](LICENSE) für Details

## 🎯 Verwendungszweck

Perfekt für:
- Roleplay Server
- Admin-Tools
- Event-Management
- Support-Teams

---

**Erstellt für FiveM Roleplay Server** 🎮