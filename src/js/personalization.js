import Dexie from "dexie";

var db = new Dexie("profile-spinner-personalization");

db.version(1).stores({
  image: `
    id,
    value`,
  metadata: `
    id,
    value`,
});

export async function getPersonalizationValue (key) {
  try {
    const data = await db.table(key).get(`${key}-0000`);
    return data?.value;
  } catch (err) {
    return null;
  }
}

export async function setPersonalizationValue (key, value) {
  const data = {
    id: `${key}-0000`,
    value
  };
  await db.table(key).put(data, key);
}
