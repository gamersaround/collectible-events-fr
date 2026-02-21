import { NextRequest, NextResponse } from "next/server";
import { getEvents } from "@/lib/queries/events";
import { parseFiltersFromParams } from "@/lib/utils/filters";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters = parseFiltersFromParams(searchParams);
    const page = parseInt(searchParams.get("page") ?? "1", 10) || 1;
    const perPage = Math.min(parseInt(searchParams.get("per_page") ?? "24", 10), 100);

    const result = await getEvents(filters, page, perPage);

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/events error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
