"use client"
// import axios from 'axios';

// const API_KEY = 'AIzaSyDWJTLDp7o_CgYQ25CnnwpnUegZrxHscF8';

// const generateText = async (prompt: { text: string }) => {
//   const response = await axios.post(
//     `https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=${API_KEY}`,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: {
//         prompt,
//       },
//     },
//   );

//   return response.data;
// };

// // Example usage:

// (async () => {
//   const story = await generateText({ text: 'Write a story about a magic backpack' });

//   console.log(story);
// })();

import React, { useState } from 'react';

export default function TextBison() {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Make a request to the API route with the prompt
    const response = await fetch(`/api/text-bison?prompt=${prompt}`);
    // Parse the response as JSON
    const data = await response.json();
    // Set the story state with the data
    setStory(data);
  };

  return (
    <div>
      <h1>Text Bison</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">Enter a prompt:</label>
        <input
          id="prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Generate</button>
      </form>
      <div>
        <h2>Story</h2>
        <p>{story}</p>
      </div>
    </div>
  );
}
