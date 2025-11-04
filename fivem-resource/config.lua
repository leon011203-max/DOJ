Config = {}

-- API Schlüssel für Discord Bot (muss mit .env vom Discord Bot übereinstimmen)
Config.ApiKey = "your_secret_api_key_here"

-- Webhook Port (muss mit dem Port vom Discord Bot übereinstimmen)
Config.WebhookPort = 30120

-- Revive Einstellungen
Config.ReviveSettings = {
    -- Spieler nach Revive heilen
    healPlayer = true,

    -- Gesundheit nach Revive (200 = volle Gesundheit)
    health = 200,

    -- Armor nach Revive
    armor = 0,

    -- Nachricht an Spieler nach Revive
    showNotification = true,
    notificationMessage = "~g~Du wurdest von einem Admin wiederbelebt!",

    -- Log in Server Console
    logToConsole = true,

    -- Koordinaten für Revive (optional, nil = aktuelle Position)
    -- reviveCoords = vector3(0.0, 0.0, 0.0)
    reviveCoords = nil
}

-- Erlaubte IPs (optional, nil = alle erlaubt)
-- Config.AllowedIPs = {"127.0.0.1", "192.168.1.100"}
Config.AllowedIPs = nil
