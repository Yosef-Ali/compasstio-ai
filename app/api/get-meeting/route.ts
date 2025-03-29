import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const issueNumber = req.nextUrl.searchParams.get("issueNumber");

    if (!issueNumber) {
        return NextResponse.json(
            { error: "Missing issue number" },
            { status: 400 }
        );
    }

    try {
        const response = await fetch("http://localhost:3000/api/mcp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                server_name: "github",
                tool_name: "get_issue",
                arguments: {
                    owner: "videosdk-live",
                    repo: "videosdk-rtc-nextjs-sdk-example",
                    issue_number: parseInt(issueNumber),
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch issue: ${response.statusText}`);
        }

        const data = await response.json();
        const issue = data.issue;

        if (!issue) {
            throw new Error("Issue not found");
        }

        // Extract meeting ID from issue body
        const meetingId = issue.body?.match(/Meeting ID: (\S+)/)?.[1];

        return NextResponse.json({
            meetingId,
            status: issue.state
        });

    } catch (error: any) {
        console.error("Error fetching meeting status:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch meeting status" },
            { status: 500 }
        );
    }
}