
export function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function formatDate (date) {
  // yyyy-MM-dd
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

export function parseDate (dateString) {
  if (!dateString) {
    return new Date();
  }

  // yyyy-MM-dd
  const [year, month, day] = dateString.split("-");
  const date = new Date(year, month - 1, day);

  return date;
}
