import { NextResponse, NextRequest } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(NextRequest) {
  const reqBody = await NextRequest.json();
  const { phoneNumber } = reqBody;
  const otp = Math.floor(100000 + Math.random() * 900000); //i have given a random 6 digit otp for our template, this can be changed for more security
                //encryption can be added if wanted
  try {
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    return NextResponse.json({
      success: true,
      messageSid: message.sid,
      otp
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
