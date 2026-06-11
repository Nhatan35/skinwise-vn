import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const HEALTH_VERSION = "v1.22";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      app: "SkinWise VN",
      version: HEALTH_VERSION,
      timestamp: new Date().toISOString(),
      checks: {
        app: "ok",
      },
    },
    { status: 200 },
  );
}
