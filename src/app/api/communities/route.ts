import { NextResponse } from 'next/server';
import { communities } from '@/lib/data/mock';

export async function GET() {
  return NextResponse.json({ data: communities });
}
