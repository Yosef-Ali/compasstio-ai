"use client";
import React from "react";
import { CircularProgress } from "@material-ui/core";

interface WaitingToJoinProps {
    message?: string;
}

const WaitingToJoin: React.FC<WaitingToJoinProps> = ({
    message = "Waiting for participants to join...",
}) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[500px] bg-gray-800 text-white p-8">
            <div className="flex flex-col items-center space-y-6 max-w-md">
                <CircularProgress color="primary" size={60} />
                <h2 className="text-xl font-semibold text-center mt-6">{message}</h2>

                <div className="text-center text-gray-300 text-sm mt-6">
                    <p>Your meeting room is ready.</p>
                    <p className="mt-2">Share the meeting link with others to invite them to join.</p>
                </div>

                <div className="flex flex-col items-center mt-8 border border-gray-600 rounded-lg p-4 bg-gray-700 w-full">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-green-400">Meeting active</p>
                    </div>
                    <p className="text-gray-300 text-sm">Waiting for participants...</p>
                </div>
            </div>
        </div>
    );
};

export default WaitingToJoin;
