"use client";

import { useTransition } from "react";
import { dismissReminder, deleteReminder } from "@/actions/reminders";
import type { ReminderStatus } from "@/db/queries/reminders";
import Button from "../ui/Button";

export default function ReminderCard({ status }: { status: ReminderStatus }) {
  const [isPending, startTransition] = useTransition();
  const { reminder, vehicle, isDue, remaining, progress } = status;

  const unit = reminder.intervalType === "odometer" ? "km" : "days";
  const progressPercent = Math.min(Math.max(progress * 100, 0), 100);

  return (
    <div
      className={`rounded-lg border p-3 ${isDue ? "border-red-400 bg-red-50" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-medium">
            {reminder.label} —{" "}
            {vehicle.nickname || `${vehicle.make} ${vehicle.model}`}
          </div>
          <div className="text-sm text-gray-500">
            {isDue
              ? `Overdue by ${Math.abs(remaining)} ${unit}`
              : `Due in ${remaining} ${unit}`}
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
            <div
              className={`h-1.5 rounded-full ${isDue ? "bg-red-500" : "bg-blue-500"}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="secondary"
            disabled={isPending}
            onClick={() =>
              startTransition(() => {
                dismissReminder(reminder.id);
              })
            }
          >
            Mark Done
          </Button>
          <Button
            variant="danger"
            disabled={isPending}
            onClick={() =>
              startTransition(() => {
                deleteReminder(reminder.id);
              })
            }
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
