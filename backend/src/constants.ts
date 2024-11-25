export const JWT_OPTIONS = {
  key: new TextEncoder().encode(Deno.env.get("APP_KEY")!),
  alg: "HS256",
}