const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
