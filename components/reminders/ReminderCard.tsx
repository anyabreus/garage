"use client";

import { useTransition } from "react";
import { Check, Trash2 } from "lucide-react";
import { dismissReminder, deleteReminder } from "@/actions/reminders";
import type { ReminderStatus } from "@/db/queries/reminders";
import Button from "../ui/Button";

export default function ReminderCard({ status }: { status: ReminderStatus }) {
  const [isPending, startTransition] = useTransition();
  const { reminder, vehicle, isDue, remaining, progress } = status;

  const unit = reminder.intervalType === "odometer" ? "km" : "days";
  const progressPercent = Math.min(Math.max(progress * 100, 0), 100);
  const isCloseToDue = progressPercent > 85;
  const vehicleName = vehicle.nickname || `${vehicle.make} ${vehicle.model}`;

  return (
    <div
      className={
        isDue
          ? "rounded-xl border-l-4 border-danger bg-surface p-3.5 shadow-sm"
          : "rounded-xl border border-border bg-surface p-3.5"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <p>
            {reminder.label}{" "}
            <span className="text-text-secondary">— {vehicleName}</span>
          </p>
          <p
            className={`mt-0.5 text-xs ${isDue ? "text-danger" : "text-text-secondary"}`}
          >
            {isDue
              ? `Overdue by ${Math.abs(remaining)} ${unit}`
              : `Due in ${remaining} ${unit}`}
          </p>

          {!isDue && (
            <div className="mt-2 h-1 w-full rounded-full bg-border">
              <div
                className={`h-full rounded-full ${isCloseToDue ? "bg-signal" : "bg-coolant"}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            onClick={() =>
              startTransition(() => {
                dismissReminder(reminder.id);
              })
            }
            aria-label="Mark done"
            className="hover:text-coolant! hover:bg-coolant/5!"
          >
            <Check size={15} />
          </Button>
          <Button
            variant="danger"
            size="icon"
            disabled={isPending}
            onClick={() =>
              startTransition(() => {
                deleteReminder(reminder.id);
              })
            }
            aria-label="Delete reminder"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}
