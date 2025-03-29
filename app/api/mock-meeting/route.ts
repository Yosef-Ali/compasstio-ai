import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { owner, repo, title, body, branch } = await req.json();

  if (!owner || !repo || !title || !body || !branch) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const githubResponse = await fetch("http://localhost:3000/api/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        server_name: "github",
        tool_name: "create_issue",
        arguments: {
          owner: owner,
          repo: repo,
          title: title,
          body: body,
        },
      }),
    });

    const githubData = await githubResponse.json();

    if (!githubData.issueNumber) {
      throw new Error("Failed to create meeting issue");
    }

    return NextResponse.json({ issueNumber: githubData.issueNumber });
  } catch (error: any) {
    console.error("Error creating meeting issue:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create meeting issue" },
      { status: 500 }
    );
  }
}