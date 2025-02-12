import { prismaDB } from "@/lib/prismaDB";
import { NextResponse } from "next/server";
export async function POST(req, res) {
const body = await req.json();

  const { id } = body;
  const pdf = await prismaDB.pdfDetails.findUnique({ where: { id } });

  if (!pdf) return NextResponse.json({ error: "Document not found",status:404 });

  return NextResponse.json({ success: true, data: pdf,status:200 });
}
