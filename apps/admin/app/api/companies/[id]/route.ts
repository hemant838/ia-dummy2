// app/api/programs/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { updateStartupById } from '~/data/startups/update-startup';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const payload = await req.json();

  const body = payload.companies;

  try {
    let data = await updateStartupById(id, body);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to update startup`
      },
      { status: 500 }
    );
  }
}
