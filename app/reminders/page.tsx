import { getUpcomingReminders } from "@/db/queries/reminders";
import ReminderCard from "@/components/reminders/ReminderCard";

export default async function RemindersPage() {
  const reminders = await getUpcomingReminders();

  const due = reminders.filter((r) => r.isDue);
  const upcoming = reminders.filter((r) => !r.isDue);

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-xl font-semibold">Reminders</h1>

      {due.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-medium text-red-600">Due Now</h2>
          <div className="space-y-2">
            {due.map((r) => (
              <ReminderCard key={r.reminder.id} status={r} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-lg font-medium">Upcoming</h2>
        {upcoming.length === 0 && (
          <p className="text-gray-500">Nothing else scheduled.</p>
        )}
        <div className="space-y-2">
          {upcoming.map((r) => (
            <ReminderCard key={r.reminder.id} status={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
