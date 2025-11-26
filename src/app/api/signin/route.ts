import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(req: Request) {
	// Minimal placeholder for signin API.
	// If you have a custom signin flow, implement it here. For now return 501.
	return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
