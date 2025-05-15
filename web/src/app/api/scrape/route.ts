import { NextResponse } from "next/server";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  const { urls, type, fields, outputFormat } = await req.json();

  console.log("urls: ", urls);
  console.log("type: ", type);
  console.log("fields: ", fields);
  console.log("outputFormat: ", outputFormat);

  await sleep(7000);

  return NextResponse.json({
    message: "Scrape request received",
  });
}
