package dev.goobhub.mcauth.data;

import com.google.gson.JsonObject;

import java.util.Objects;

public class Player {
  public final String id;

  public final String action;

  public Player(JsonObject data) {
    this.id = data.get("id").getAsString();
    this.action = data.get("action").getAsString();
  }

  public boolean isAllowed() {
    return Objects.equals(this.action, "allow");
  }

  public boolean isDisallowed() {
    return Objects.equals(this.action, "disallow");
  }
}
