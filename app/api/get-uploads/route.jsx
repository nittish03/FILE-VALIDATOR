import { prismaDB } from "@/lib/prismaDB";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pdfs = await prismaDB.pdfDetails.findMany();

    return NextResponse.json({
      success: true,
      data: pdfs,
      status: 200
    });

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch PDFs.",
      error: error.message,
      status: 500
    });
  }
}
