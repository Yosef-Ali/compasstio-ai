# Plan to Fix Meeting Creation

This plan outlines the steps to fix the meeting creation functionality in the `app/(dashboard)/(route)/live-sessions/page.tsx` file using the MCP github tool.

## 1. Replace the existing `createMeeting` function in `lib/api.ts`

The existing `createMeeting` function will be replaced with a new function that uses the MCP github tool to create an issue in the `videosdk-live/videosdk-rtc-nextjs-sdk-example` repository. This issue will request a new meeting to be created.

## 2. Modify the `JoiningScreen` component

The `JoiningScreen` component will be modified to handle the response from the GitHub issue. This will involve checking the status of the issue and extracting the meeting ID from the issue body.

## 3. Update the `validateMeeting` function in `lib/api.ts`

The `validateMeeting` function will be updated to validate the meeting ID.

## Mermaid Diagram

```mermaid
sequenceDiagram
    participant User
    participant JoiningScreen
    participant lib/api.ts
    participant GitHub (MCP)

    User->>JoiningScreen: Clicks "Start Meeting"
    JoiningScreen->>lib/api.ts: Calls createMeeting()
    lib/api.ts->>GitHub (MCP): Uses create_issue tool to create issue in videosdk-live/videosdk-rtc-nextjs-sdk-example
    GitHub (MCP)-->>lib/api.ts: Returns issue ID
    lib/api.ts->>JoiningScreen: Returns issue ID
    JoiningScreen->>User: Displays "Creating Meeting..." with issue ID
    loop Check issue status
        JoiningScreen->>GitHub (MCP): Uses get_issue tool to get issue status
        GitHub (MCP)-->>JoiningScreen: Returns issue status and body
        alt Issue closed with meeting ID
            JoiningScreen->>lib/api.ts: Calls validateMeeting()
            lib/api.ts->>GitHub (MCP): Uses get_issue tool to validate meeting ID
            GitHub (MCP)-->>lib/api.ts: Returns validation result
            lib/api.ts->>JoiningScreen: Returns validation result
            JoiningScreen->>User: Navigates to meeting
        else Issue still open
            JoiningScreen->>User: Displays "Creating Meeting..." with issue ID
        end
    end