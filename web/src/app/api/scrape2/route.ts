import { NextResponse } from "next/server";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  const { url, type, instruction, outputFormat } = await req.json();

  console.log("urls: ", url);
  console.log("type: ", type);
  console.log("instruction: ", instruction);
  console.log("outputFormat: ", outputFormat);

  await sleep(7000);

  return NextResponse.json({
    message: "Scrape request received",
  });
}
