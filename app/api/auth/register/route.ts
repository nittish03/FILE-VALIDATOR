import { prismaDB } from "@/lib/prismaDB";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { OTPHandler } from "@/lib/sendEmail";

export async function POST(request: Request) {
    const body = await request.json();
    const { email, username, password } = body;

    if (!username || !email || !password) {
        return NextResponse.json("Missing value name, email or password", {
            status: 422
        })
    }

    const userExist = await prismaDB.user.findUnique({
        where: {
            email
        }
    })
    if (userExist) {
        return new NextResponse("User already exists", {
            status: 401
        })
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const otpClient = new OTPHandler(email)
        const otp = otpClient.getOTP()
        const otpExpiry = new Date(Date.now() + 60 * 1000)

        await prismaDB.nonVerifiedUser.upsert({
            where: {
                email
            },
            create: {
                name: username,
                email,
                hashedPassword,
                otp,
                otpExpiry
            },
            update: {
                name: username,
                hashedPassword,
                otp,
                otpExpiry
            }
        })
        otpClient.sendOTP()

        return NextResponse.json({
            message: "OTP sent, check your email",
            success: true
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}