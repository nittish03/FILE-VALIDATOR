import { prismaDB } from "@/lib/prismaDB";
import { NextResponse } from "next/server";
export async function POST(req) {
try{
  const body = await req.json();
  const { id } = body;
  const deletedPdf = await prismaDB.pdfDetails.delete({ where: { id: id } });
  
  if (!deletedPdf) return res.status(404).json({ error: "File not found." });
  
  return NextResponse.json({ success: true, message: "File deleted successfully.",status:200 });
}catch(e){
  console.log(e);
  return 
}
}
