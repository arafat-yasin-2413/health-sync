"use server";

import { GoogleGenAI, Type } from "@google/genai";

const apiKey =
    process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.error(
        "❌ CRITICAL ERROR: Gemini API Key is missing in environment variables!",
    );
}

// Production safe initialization using the new SDK
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function parseMedicalDocument(
    base64Data: string,
    mimeType: string,
    patientId: string,
) {
    try {
        if (!ai) {
            return {
                success: false,
                error: "Server configuration error: Gemini API connection could not be established.",
            };
        }

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
            Extract the data accurately into the requested JSON schema without inventing any facts.
            If a field is missing, leave it as an empty string or empty array as defined.
        `;

        // Call using the correct model name and structured schema for `@google/genai`
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Updated to the correct model identifier
            contents: [filePart, prompt],
            config: {
                responseMimeType: "application/json",
                // Defining a strict schema guarantees clean JSON output with no markdown backticks
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        patientId: { type: Type.STRING },
                        recordId: { type: Type.STRING },
                        doctorName: {
                            type: Type.STRING,
                            description: "Extracted Doctor Name",
                        },
                        date: {
                            type: Type.STRING,
                            description:
                                "YYYY-MM-DD (Extract prescription date, if missing use today)",
                        },
                        patientCase: {
                            type: Type.STRING,
                            description:
                                "Brief summary of symptoms or clinical notes",
                        },
                        respiratoryRate: {
                            type: Type.STRING,
                            description: "Extract RR if available, else 'N/A'",
                        },
                        bloodPressure: {
                            type: Type.STRING,
                            description: "Extract BP if available, else 'N/A'",
                        },
                        medicines: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    dosage: {
                                        type: Type.STRING,
                                        description: "e.g. 1+0+1",
                                    },
                                    duration: {
                                        type: Type.STRING,
                                        description: "e.g. 7 Days",
                                    },
                                    category: {
                                        type: Type.STRING,
                                        description:
                                            "Antibiotic OR Gastric OR Vitamin OR Calcium OR General",
                                    },
                                },
                                required: [
                                    "name",
                                    "dosage",
                                    "duration",
                                    "category",
                                ],
                            },
                        },
                    },
                    required: [
                        "patientId",
                        "recordId",
                        "doctorName",
                        "date",
                        "patientCase",
                        "respiratoryRate",
                        "bloodPressure",
                        "medicines",
                    ],
                },
            },
        });

        const rawJson = response.text;

        if (!rawJson) {
            throw new Error(
                "Gemini AI returned an empty or invalid content stream.",
            );
        }

        // Since responseSchema enforces strict JSON, you no longer need markdown string replacement logic
        const parsedData = JSON.parse(rawJson);

        // Inject dynamic values if needed, or rely on schema generation
        parsedData.patientId = patientId;
        if (!parsedData.recordId) {
            parsedData.recordId = `REC-${Math.floor(100000 + Math.random() * 900000)}`;
        }

        return { success: true, data: parsedData };
    } catch (error) {
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

// "use server";

// import { GoogleGenAI } from "@google/genai";

// const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// if (!apiKey) {
//     console.error(
//         "❌ CRITICAL ERROR: Gemini API Key is missing in environment variables!",
//     );
// }

// // production safe initialization
// const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// export async function parseMedicalDocument(
//     base64Data: string,
//     mimeType: string,
//     patientId: string,
// ) {
//     try {
//         if (!ai) {
//             return {
//                 success: false,
//                 error: "Server configuration error: Gemini API connection could not be established.",
//             };
//         }

//         const base64Content = base64Data.includes("base64,")
//             ? base64Data.split("base64,")[1]
//             : base64Data;

//         const filePart = {
//             inlineData: {
//                 data: base64Content,
//                 mimeType: mimeType,
//             },
//         };

//         const prompt = `
//             You are an expert clinical data extraction engine.
//             Analyze the attached medical document (PDF/Image) carefully.
//             Extract the data accurately without inventing any facts.
//             If a field is missing, use an empty string "" or empty array [].

//             Return the output STRICTLY as a raw JSON object matching this schema without markdown blocks:
//             {
//                 "patientId": "${patientId}",
//                 "recordId": "REC-${Math.floor(100000 + Math.random() * 900000)}",
//                 "doctorName": "Extracted Doctor Name",
//                 "date": "YYYY-MM-DD (Extract prescription date, if missing use today)",
//                 "patientCase": "Brief summary of symptoms or clinical notes",
//                 "respiratoryRate": "Extract RR if available, else 'N/A'",
//                 "bloodPressure": "Extract BP if available, else 'N/A'",
//                 "medicines": [
//                     { "name": "Drug Name", "dosage": "e.g. 1+0+1", "duration": "e.g. 7 Days", "category": "Antibiotic OR Gastric OR Vitamin OR Calcium OR General" }
//                 ]
//             }
//         `;

//         // to avoid 404 error on deployment,
//         // .. google cloud official recommended model calling syntax
//         const response = await ai.models.generateContent({
//             model: "gemini-1.5-flash",
//             contents: [filePart, prompt],
//             config: {
//                 responseMimeType: "application/json",
//             },
//         });

//         let rawJson = response.text;

//         if (!rawJson) {
//             throw new Error("Gemini AI returned an empty or invalid content stream.");
//         }

//         if (rawJson.includes("```")) {
//             rawJson = rawJson
//                 .replace(/```json/g, "")
//                 .replace(/```/g, "")
//                 .trim();
//         }

//         const parsedData = JSON.parse(rawJson);
//         return { success: true, data: parsedData };

//     } catch (error) {
//         console.error("Detailed Server AI Pipeline Crash Logs:", error);
//         const errorMessage = error instanceof Error ? error.message : "Parsing layer extraction exception";
//         return {
//             success: false,
//             error: `AI Error: ${errorMessage}`,
//         };
//     }
// }

// "use server";

// import { GoogleGenAI } from "@google/genai";

// // 1. API Key validation with fallback for client side and server side
// const apiKey =
//     process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// if (!apiKey) {
//     console.error(
//         "❌ CRITICAL ERROR: Gemini API Key is missing in environment variables!",
//     );
// }

// const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// export async function parseMedicalDocument(
//     base64Data: string,
//     mimeType: string,
//     patientId: string,
// ) {
//     try {
//         // 2. Api key check on runtime
//         if (!ai) {
//             return {
//                 success: false,
//                 error: "Server configuration error: Gemini API connection could not be established.",
//             };
//         }

//         // 3. strong Base64 sanitization (will remove any uri skim or prefix)
//         const base64Content = base64Data.includes("base64,")
//             ? base64Data.split("base64,")[1]
//             : base64Data;

//         const filePart = {
//             inlineData: {
//                 data: base64Content,
//                 mimeType: mimeType,
//             },
//         };

//         const prompt = `
//             You are an expert clinical data extraction engine.
//             Analyze the attached medical document (PDF/Image) carefully.
//             Extract the data accurately without inventing any facts.
//             If a field is missing, use an empty string "" or empty array [].

//             Return the output STRICTLY as a raw JSON object matching this schema without markdown blocks:
//             {
//                 "patientId": "${patientId}",
//                 "recordId": "REC-${Math.floor(100000 + Math.random() * 900000)}",
//                 "doctorName": "Extracted Doctor Name",
//                 "date": "YYYY-MM-DD (Extract prescription date, if missing use today)",
//                 "patientCase": "Brief summary of symptoms or clinical notes",
//                 "respiratoryRate": "Extract RR if available, else 'N/A'",
//                 "bloodPressure": "Extract BP if available, else 'N/A'",
//                 "medicines": [
//                     { "name": "Drug Name", "dosage": "e.g. 1+0+1", "duration": "e.g. 7 Days", "category": "Antibiotic OR Gastric OR Vitamin OR Calcium OR General" }
//                 ]
//             }
//         `;

//         // API call execution with Gemini model fallback

//         const response = await ai.models.generateContent({
//             model: "gemini-1.5-flash",
//             contents: [filePart, prompt],
//             config: {
//                 responseMimeType: "application/json",
//             },
//         });

//         // let response;
//         // try {
//         //     response = await ai.models.generateContent({
//         //         // model format for new SDK
//         //         model: "gemini-2.5-flash",
//         //         contents: [filePart, prompt],
//         //         config: { responseMimeType: "application/json" },
//         //     });
//         // } catch (firstError) {
//         //     // Model backup retry if error comes from new model.
//         //     console.log(
//         //         "Model 2.5 busy or failed, switching automatically to 1.5-flash...",
//         //     );
//         //     await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds pause

//         //     response = await ai.models.generateContent({
//         //         // fallback model name
//         //         model: "gemini-1.5-flash",
//         //         contents: [filePart, prompt],
//         //         config: { responseMimeType: "application/json" },
//         //     });
//         // }

//         let rawJson = response.text;

//         if (!rawJson) {
//             throw new Error(
//                 "Gemini AI returned an empty or invalid content stream.",
//             );
//         }

//         // 5. safety filter: Mechanism to clean markdown
//         if (rawJson.includes("```")) {
//             rawJson = rawJson
//                 .replace(/```json/g, "")
//                 .replace(/```/g, "")
//                 .trim();
//         }

//         // 6. Type safe data parsing
//         const parsedData = JSON.parse(rawJson);

//         return { success: true, data: parsedData };
//     } catch (error) {
//         console.error("Detailed Server AI Pipeline Crash Logs:", error);

//         const errorMessage =
//             error instanceof Error
//                 ? error.message
//                 : "Parsing layer extraction exception";

//         return {
//             success: false,
//             error: `AI Error: ${errorMessage}`,
//         };
//     }
// }
