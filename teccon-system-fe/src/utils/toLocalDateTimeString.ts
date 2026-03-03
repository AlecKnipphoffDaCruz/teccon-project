export default function toLocalDateTimeString(time: string): string {
  // time = "09:57"
  const today = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  today.setHours(hours, minutes, 0, 0); // define hora e minuto
  return today.toISOString(); // retorna "2026-03-02T09:57:00.000Z"
}
