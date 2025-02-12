import { prismaDB } from "@/lib/prismaDB";
import { NextRequest,NextResponse } from "next/server";

export async function GET(req) {
  if (req.method !== "GET") return NextResponse.json({ error: "Method Not Allowed",status:405 });

  const pdfs = await prismaDB.pdfDetails.findMany();
  return NextResponse.json({ success: true, data: pdfs,status:200 });
}
