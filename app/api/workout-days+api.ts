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

  const result = await db.execute({
    sql: 'SELECT * FROM workout_days WHERE user_id = ? ORDER BY created_at ASC',
    args: [userId],
  });

  return Response.json(result.rows);
}

export async function POST(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { name } = await request.json();
  if (!name) return Response.json({ error: 'Name is required' }, { status: 400 });

  const id = crypto.randomUUID();

  await db.execute({
    sql: 'INSERT INTO workout_days (id, user_id, name) VALUES (?, ?, ?)',
    args: [id, userId, name],
  });

  return Response.json({ id, user_id: userId, name }, { status: 201 });
}

export async function PUT(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, name } = await request.json();
  if (!id || !name) return Response.json({ error: 'id and name are required' }, { status: 400 });

  await db.execute({
    sql: 'UPDATE workout_days SET name = ? WHERE id = ? AND user_id = ?',
    args: [name, id, userId],
  });

  return Response.json({ success: true });
}

export async function DELETE(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await request.json();
  if (!id) return Response.json({ error: 'id is required' }, { status: 400 });

  await db.execute({
    sql: 'DELETE FROM workout_days WHERE id = ? AND user_id = ?',
    args: [id, userId],
  });

  return Response.json({ success: true });
}