"use client";

import { deleteFuelLog } from "@/actions/fuel-logs";
import { fuelLogsTable } from "@/db/schema";

export default function FuelLogRow({
  log,
}: {
  log: typeof fuelLogsTable.$inferSelect;
}) {
  const handleDelete = async () => {
    if (!confirm("Delete this log?")) return;
    deleteFuelLog(log.id);
  };

  return (
    <li>
      <p>Date: {log.date.toLocaleDateString("en-US", { timeZone: "UTC" })}</p>
      <p>Odometer: {log.odometer}</p>
      <p>Fuel Amount: {log.fuelAmount}</p>
      <p>Price Per Unit: {log.pricePerUnit}</p>
      <p>Total Cost: {log.totalCost}</p>
      <p>Is Full Tank: {log.isFullTank ? "Yes" : "No"}</p>
      <button type="button" onClick={handleDelete}>
        Delete Log
      </button>
    </li>
  );
}
