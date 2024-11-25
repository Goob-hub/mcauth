package dev.goobhub.mcauth;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import org.bukkit.Bukkit;
import org.bukkit.OfflinePlayer;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import dev.goobhub.mcauth.data.Player;

public class Client {

    private static final HttpClient client = HttpClient.newHttpClient();
    private final String host;
    private String token;


    public Client(String host, String token) {
        this.host = host;
        this.token = token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public CompletableFuture<List<Player>> getCurrentState() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(String.format("%s/api/events", host)))
                .header("Authorization", "Bearer " + token)
                .header("Accept", "application/json")
                .GET()
                .build();

        return client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(response -> {
                    if (response.statusCode() != 200) {
                        throw new RuntimeException("Request failed with status code: " + response.statusCode());
                    }

                    String responseBody = response.body();
                    JsonElement jsonElement = JsonParser.parseString(responseBody);
                    if (jsonElement.isJsonArray()) {
                        ArrayList<Player> result = new ArrayList<>();
                        var data = jsonElement.getAsJsonArray();
                        for (JsonElement element : data) {
                            result.add(new Player(element.getAsJsonObject()));
                        }

                        return result;
                    } else {
                        throw new RuntimeException("Response is not a valid JSON object");
                    }
                });
    }

    public void handle(Player player) {
        OfflinePlayer mcPlayer = Bukkit.getOfflinePlayer(UUID.fromString(player.id));
        mcPlayer.setWhitelisted(player.isAllowed());
        Bukkit.reloadWhitelist();
    }
}
