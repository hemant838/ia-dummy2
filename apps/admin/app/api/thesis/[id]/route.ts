// app/api/programs/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { updateApplicationById } from '~/data/applications/update-startup-application';
import { getThesisById } from '~/data/thesis/get-thesis';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id }: any = await params;

  try {
    let data: any = {};

    if (id) {
      data = await getThesisById(id);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to get thesis for ${id}`
      },
      { status: 500 }
    );
  }
}
