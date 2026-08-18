"use client";

import Link from "next/link";
import { vehiclesTable } from "@/db/schema";

export default function VehicleCard({
  vehicle,
}: {
  vehicle: typeof vehiclesTable.$inferSelect;
}) {
  return (
    <li className="relative border rounded p-4 hover:bg-amber-400">
      <Link href={`/vehicles/${vehicle.id}`} className="absolute inset-0" />
      <h2>
        {vehicle.make} {vehicle.model}
      </h2>
      <p>Year: {vehicle.year}</p>
    </li>
  );
}
