import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/cloudflare';
import { verifyPassword } from '@/lib/crypto';
import { createSession } from '@/lib/auth';
export async function POST(req:NextRequest){try{const {email,password}=await req.json() as {email:string,password:string};const e=await env();const user=await e.DB.prepare('SELECT id,password_hash FROM users WHERE email=?').bind(email?.trim().toLowerCase()).first<{id:string,password_hash:string}>();if(!user||!await verifyPassword(password||'',user.password_hash))return NextResponse.json({error:'Email or password is incorrect.'},{status:401});await createSession(user.id);return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Unable to log in.'},{status:500});}}
