import { NextResponse } from 'next/server';
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { UserService } from '@/db/directory/user.service';

const SECRET_KEY = process.env.JWT_SECRET || 'rahasia-kita';
const secret = new TextEncoder().encode(SECRET_KEY);

// 🔥 HELPER: Validasi agar Admin tidak bisa saling serang
async function isPeerAdmin(currentUserId: number, targetUserId: number) {
  // Jika mengedit diri sendiri, loloskan (atau biarkan di-handle oleh endpoint /me)
  if (currentUserId === targetUserId) return false; 
  
  try {
    // Kita manfaatkan UserService.getMe karena fungsinya mengambil user by ID
    const currentUser = await UserService.getMe(currentUserId);
    const targetUser = await UserService.getMe(targetUserId);

    return currentUser.role === 'Admin' && targetUser.role === 'Admin';
  } catch (error) {
    // Jika user tidak ditemukan, anggap saja tidak valid untuk mencegah eksekusi
    return true; 
  }
}

export async function GET() {
  try {
    const data = await UserService.getAllUsers();
    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await UserService.createUser(body);
    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: err.message.includes('terdaftar') ? 400 : 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id_user) return NextResponse.json({ status: 'fail', message: 'ID User diperlukan' }, { status: 400 });
    
    const targetUserId = Number(body.id_user);

    // --- SECURITY CHECK START ---
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    if (!token) {
      return NextResponse.json({ status: "fail", message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secret);
    const currentUserId = Number(payload.id);

    const peerAdmin = await isPeerAdmin(currentUserId, targetUserId);
    if (peerAdmin) {
      return NextResponse.json({ status: 'fail', message: 'Akses ditolak: Tidak dapat mengedit sesama Admin' }, { status: 403 });
    }
    // --- SECURITY CHECK END ---

    const data = await UserService.updateUser(targetUserId, body);
    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'fail', message: 'ID diperlukan' }, { status: 400 });

    const targetUserId = Number(id);

    // --- SECURITY CHECK START ---
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    if (!token) {
      return NextResponse.json({ status: "fail", message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secret);
    const currentUserId = Number(payload.id);

    const peerAdmin = await isPeerAdmin(currentUserId, targetUserId);
    if (peerAdmin) {
      return NextResponse.json({ status: 'fail', message: 'Akses ditolak: Tidak dapat menghapus sesama Admin' }, { status: 403 });
    }
    // --- SECURITY CHECK END ---

    await UserService.deleteUser(targetUserId);
    return NextResponse.json({ status: 'success', message: 'User berhasil dihapus' });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}