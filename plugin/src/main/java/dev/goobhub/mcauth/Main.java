package dev.dylhack.mcauth;

import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.plugin.java.JavaPlugin;

public class Main extends JavaPlugin {
    @Override
    public void onEnable() {
        saveDefaultConfig();
        FileConfiguration config = this.getConfig();

        String server = config.getString("server", "https://mcauth.dev");
        String token = config.getString("token", "");
        Client client = new Client(server, token);

        try {
            client.getCurrentState().thenAccept(players -> {
                players.forEach(client::handle);
            });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
