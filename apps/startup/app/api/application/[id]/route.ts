// app/api/programs/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { updateApplicationById } from '~/data/applications/update-startup-application';
import { updateStartupById } from '~/data/startups/update-startup';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body = await req.json();

  try {
    let data: any = {};
    if (body.applications) {
      data = await updateApplicationById(id, body.applications);
    }

    if (body.startup && body.startup.id) {
      data = await updateStartupById(body.startup.id, body.startup);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to update ${body.startup ? 'startup' : 'application'}`
      },
      { status: 500 }
    );
  }
}
