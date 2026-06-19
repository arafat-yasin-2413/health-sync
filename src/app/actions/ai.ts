"use server";

import { GoogleGenAI } from "@google/genai";

// ১. সার্ভার ও ক্লায়েন্ট দুই দিকের সেফটির জন্য ফলব্যাকসহ API Key ভ্যালিডেশন
const apiKey =
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error(
        "❌ CRITICAL ERROR: Gemini API Key is missing in environment variables!",
    );
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function parseMedicalDocument(
    base64Data: string,
    mimeType: string,
    patientId: string,
) {
    try {
        // ২. রানটাইম গেটওয়ে চেক
        if (!ai) {
            return {
                success: false,
                error: "Server configuration error: Gemini API connection could not be established.",
            };
        }

        // ৩. স্ট্রং Base64 স্যানিটাইজেশন (কোনো প্রকার URI স্কিম বা প্রিফিক্স থাকলে তা রিমুভ করবে)
        const base64Content = base64Data.includes("base64,")
            ? base64Data.split("base64,")[1]
            : base64Data;

        const filePart = {
            inlineData: {
                data: base64Content,
                mimeType: mimeType,
            },
        };

        const prompt = `
            You are an expert clinical data extraction engine.
            Analyze the attached medical document (PDF/Image) carefully.
            Extract the data accurately without inventing any facts.
            If a field is missing, use an empty string "" or empty array [].

            Return the output STRICTLY as a raw JSON object matching this schema without markdown blocks:
            {
                "patientId": "${patientId}",
                "recordId": "REC-${Math.floor(100000 + Math.random() * 900000)}",
                "doctorName": "Extracted Doctor Name",
                "date": "YYYY-MM-DD (Extract prescription date, if missing use today)",
                "patientCase": "Brief summary of symptoms or clinical notes",
                "respiratoryRate": "Extract RR if available, else 'N/A'",
                "bloodPressure": "Extract BP if available, else 'N/A'",
                "medicines": [
                    { "name": "Drug Name", "dosage": "e.g. 1+0+1", "duration": "e.g. 7 Days", "category": "Antibiotic OR Gastric OR Vitamin OR Calcium OR General" }
                ]
            }
        `;

        // ৪. এপিআই কল এক্সিকিউশন
        // ৫. জেমিনি মডেল এক্সিকিউশন (with a quick automatic retry fallback)
       
        let response;
        try {
            response = await ai.models.generateContent({
                // ফিক্স ১: নতুন SDK-এর জন্য মডেল ফরম্যাট
                model: "gemini-2.5-flash",
                contents: [filePart, prompt],
                config: { responseMimeType: "application/json" },
            });
        } catch (firstError) {
            // যদি ডিমান্ড হাই থাকে বা ৫০৩ এরর আসে, ২ সেকেন্ড অপেক্ষা করে ১.৫ মডেল দিয়ে ব্যাকআপ ট্রাই করবে
            console.log(
                "Model 2.5 busy or failed, switching automatically to 1.5-flash...",
            );
            await new Promise((resolve) => setTimeout(resolve, 2000)); // ২ সেকেন্ড পজ

            response = await ai.models.generateContent({
                // ফিক্স ২: ফলব্যাক মডেলেও সঠিক নাম ব্যবহার করুন
                model: "gemini-1.5-flash",
                contents: [filePart, prompt],
                config: { responseMimeType: "application/json" },
            });
        }

        let rawJson = response.text;

        if (!rawJson) {
            throw new Error(
                "Gemini AI returned an empty or invalid content stream.",
            );
        }

        // ৫. সেফটি ফিল্টার: জেমিনি যদি প্রম্পট অমান্য করে মার্কডাউন ব্যাকটিক্স (```json) দেয়, তা ক্লিন করার মেকানিজম
        if (rawJson.includes("```")) {
            rawJson = rawJson
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
        }

        // ৬. টাইপ-সেফ ডাটা পার্সিং
        const parsedData = JSON.parse(rawJson);

        return { success: true, data: parsedData };
    } catch (error: unknown) {
        // টার্মিনালে আসল এরর অবজেক্টটি ডিটেইলসে দেখতে পাবেন (যেমন: Auth Failure, Model Not Found বা Syntax Error)
        console.error("Detailed Server AI Pipeline Crash Logs:", error);

        const errorMessage =
            error instanceof Error
                ? error.message
                : "Parsing layer extraction exception";

        return {
            success: false,
            error: `AI Error: ${errorMessage}`,
        };
    }
}
