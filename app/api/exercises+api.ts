import { db } from '@/lib/db';
import { createClerkClient } from '@clerk/clerk-sdk-node';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

async function getUserId(request: Request): Promise<string | null> {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const payload = await clerk.verifyToken(token);
    return payload.sub;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const dayId = searchParams.get('dayId');
  if (!dayId) return Response.json({ error: 'dayId is required' }, { status: 400 });

  const day = await db.execute({
    sql: 'SELECT id FROM workout_days WHERE id = ? AND user_id = ?',
    args: [dayId, userId],
  });
  if (day.rows.length === 0) return Response.json({ error: 'Not found' }, { status: 404 });

  const result = await db.execute({
    sql: 'SELECT * FROM exercises WHERE day_id = ? ORDER BY created_at ASC',
    args: [dayId],
  });

  return Response.json(result.rows);
}

export async function POST(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { day_id, name, sets, value, unit, note } = await request.json();
  if (!day_id || !name || !sets || !value || !unit)
    return Response.json({ error: 'Missing required fields' }, { status: 400 });

  const day = await db.execute({
    sql: 'SELECT id FROM workout_days WHERE id = ? AND user_id = ?',
    args: [day_id, userId],
  });
  if (day.rows.length === 0) return Response.json({ error: 'Not found' }, { status: 404 });

  const id = crypto.randomUUID();

  await db.execute({
    sql: 'INSERT INTO exercises (id, day_id, name, sets, value, unit, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [id, day_id, name, sets, value, unit, note ?? null],
  });

  return Response.json({ id, day_id, name, sets, value, unit, note }, { status: 201 });
}

export async function PUT(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, name, sets, value, unit, note } = await request.json();
  if (!id || !name || !sets || !value || !unit)
    return Response.json({ error: 'Missing required fields' }, { status: 400 });

  await db.execute({
    sql: `UPDATE exercises SET name = ?, sets = ?, value = ?, unit = ?, note = ?
          WHERE id = ? AND day_id IN (SELECT id FROM workout_days WHERE user_id = ?)`,
    args: [name, sets, value, unit, note ?? null, id, userId],
  });

  return Response.json({ success: true });
}

export async function DELETE(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await request.json();
  if (!id) return Response.json({ error: 'id is required' }, { status: 400 });

  await db.execute({
    sql: `DELETE FROM exercises WHERE id = ? AND day_id IN (SELECT id FROM workout_days WHERE user_id = ?)`,
    args: [id, userId],
  });

  return Response.json({ success: true });
}