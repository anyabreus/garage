import { getUpcomingReminders } from "@/db/queries/reminders";
import ReminderCard from "@/components/reminders/ReminderCard";

export default async function RemindersPage() {
  const reminders = await getUpcomingReminders();

  const due = reminders.filter((r) => r.isDue);
  const upcoming = reminders.filter((r) => !r.isDue);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <h1>Reminders</h1>

      {reminders.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-text-secondary">
          No reminders yet — add one from a vehicle&apos;s page to start
          tracking it.
        </div>
      )}

      {due.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" />
            <h2 className="text-xs font-semibold uppercase tracking-wide text-danger">
              Due now
            </h2>
          </div>
          <ul className="flex flex-col gap-2">
            {due.map((status) => (
              <li key={status.reminder.id}>
                <ReminderCard status={status} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2>Upcoming</h2>
          <ul className="flex flex-col gap-2">
            {upcoming.map((status) => (
              <li key={status.reminder.id}>
                <ReminderCard status={status} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
