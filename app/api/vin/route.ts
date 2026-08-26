import { NextRequest, NextResponse } from "next/server";
import { decodeVin } from "@/lib/vin-decoder";

export async function GET(request: NextRequest) {
  const vin = request.nextUrl.searchParams.get("vin");

  if (!vin || vin.length !== 17) {
    return NextResponse.json({ error: "Invalid VIN" }, { status: 400 });
  }

  const decoded = await decodeVin(vin);

  if (!decoded || !decoded.make) {
    return NextResponse.json({ error: "VIN not found" }, { status: 404 });
  }

  return NextResponse.json(decoded);
}
