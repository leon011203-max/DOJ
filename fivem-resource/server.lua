-- HTTP Endpoint für Revive Command
SetHttpHandler(function(request, response)
    local path = request.path

    -- Nur /revive endpoint
    if path ~= "/revive" then
        response.writeHead(404, {["Content-Type"] = "application/json"})
        response.send(json.encode({success = false, message = "Endpoint nicht gefunden"}))
        return
    end

    -- Nur POST requests
    if request.method ~= "POST" then
        response.writeHead(405, {["Content-Type"] = "application/json"})
        response.send(json.encode({success = false, message = "Nur POST Requests erlaubt"}))
        return
    end

    -- IP Check (optional)
    if Config.AllowedIPs then
        local clientIP = request.headers["x-forwarded-for"] or request.address
        local ipAllowed = false

        for _, allowedIP in ipairs(Config.AllowedIPs) do
            if clientIP == allowedIP then
                ipAllowed = true
                break
            end
        end

        if not ipAllowed then
            response.writeHead(403, {["Content-Type"] = "application/json"})
            response.send(json.encode({success = false, message = "IP nicht autorisiert"}))
            return
        end
    end

    -- Request Body parsen
    local body = request.body
    local data = json.decode(body)

    if not data then
        response.writeHead(400, {["Content-Type"] = "application/json"})
        response.send(json.encode({success = false, message = "Ungültiger Request Body"}))
        return
    end

    -- API Key überprüfen
    if data.apiKey ~= Config.ApiKey then
        response.writeHead(401, {["Content-Type"] = "application/json"})
        response.send(json.encode({success = false, message = "Ungültiger API Key"}))
        return
    end

    -- Spieler ID überprüfen
    local playerId = tonumber(data.playerId)

    if not playerId then
        response.writeHead(400, {["Content-Type"] = "application/json"})
        response.send(json.encode({success = false, message = "Ungültige Spieler ID"}))
        return
    end

    -- Spieler existiert?
    local playerPed = GetPlayerPed(playerId)

    if not playerPed or playerPed == 0 then
        response.writeHead(404, {["Content-Type"] = "application/json"})
        response.send(json.encode({success = false, message = "Spieler nicht auf dem Server gefunden"}))
        return
    end

    -- Spieler wiederbeleben
    local success = RevivePlayer(playerId)

    if success then
        response.writeHead(200, {["Content-Type"] = "application/json"})
        response.send(json.encode({
            success = true,
            message = "Spieler erfolgreich wiederbelebt",
            playerId = playerId
        }))
    else
        response.writeHead(500, {["Content-Type"] = "application/json"})
        response.send(json.encode({success = false, message = "Fehler beim Wiederbeleben"}))
    end
end)

-- Funktion zum Wiederbeleben eines Spielers
function RevivePlayer(playerId)
    local playerPed = GetPlayerPed(playerId)

    if not playerPed or playerPed == 0 then
        return false
    end

    -- Spieler Namen holen
    local playerName = GetPlayerName(playerId)

    -- Revive durchführen
    if Config.ReviveSettings.reviveCoords then
        -- Mit Teleport zu bestimmten Koordinaten
        SetEntityCoords(playerPed, Config.ReviveSettings.reviveCoords.x, Config.ReviveSettings.reviveCoords.y, Config.ReviveSettings.reviveCoords.z)
    end

    -- Spieler wiederbeleben (verschiedene Methoden je nach Framework)

    -- Methode 1: Natives (funktioniert immer)
    local maxHealth = GetEntityMaxHealth(playerPed)
    SetEntityHealth(playerPed, Config.ReviveSettings.health or maxHealth)

    -- Armor setzen
    if Config.ReviveSettings.armor and Config.ReviveSettings.armor > 0 then
        SetPedArmour(playerPed, Config.ReviveSettings.armor)
    end

    -- Spieler aufstehen lassen
    ClearPedTasksImmediately(playerPed)

    -- ESX Framework (falls vorhanden)
    TriggerClientEvent('esx_ambulancejob:revive', playerId)

    -- QBCore Framework (falls vorhanden)
    TriggerClientEvent('hospital:client:Revive', playerId)

    -- vRP Framework (falls vorhanden)
    TriggerClientEvent('vRP:revive', playerId)

    -- Notification an Spieler
    if Config.ReviveSettings.showNotification then
        TriggerClientEvent('chat:addMessage', playerId, {
            color = {0, 255, 0},
            multiline = true,
            args = {"System", Config.ReviveSettings.notificationMessage}
        })
    end

    -- Console Log
    if Config.ReviveSettings.logToConsole then
        print(string.format("[REVIVE] Spieler %s (ID: %d) wurde wiederbelebt", playerName, playerId))
    end

    return true
end

-- Server Start
CreateThread(function()
    print("^2========================================^0")
    print("^2[FiveM Revive Bot] Resource gestartet^0")
    print("^3[INFO] Discord Bot Integration aktiv^0")
    print("^3[INFO] Endpoint: /revive^0")
    print("^2========================================^0")
end)

-- Export für andere Resources
exports('RevivePlayer', RevivePlayer)
