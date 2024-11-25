import { allow, disallow, linkAccount } from "./db.ts";

export async function seed() {
  const theWoah = "1079492811126231051"
  const busybox = await linkAccount("164837347156951040", "5bce3068-e4f3-489f-b66b-5723b2a7cdb1")
  const manofpot = await linkAccount("156405728788217856", "157ed45a-a39a-4515-8c67-c5f00bbf4cce")
  const andrew = await linkAccount("342015069141336064", "5b60c353-f620-4732-8fd3-79c454e00f54")
  await allow(theWoah, busybox.id);
  await allow(theWoah, manofpot.id);
  await allow(theWoah, andrew.id);
  await disallow(theWoah, busybox.id);
}
