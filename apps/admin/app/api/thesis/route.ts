// app/api/programs/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { getAllThesis } from '~/data/thesis/get-thesis';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '8', 10);

  try {
    const data = await getAllThesis(page, pageSize);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch thesis' },
      { status: 500 }
    );
  }
}
