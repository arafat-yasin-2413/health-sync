"use server";

import { MedicalRecord, MedicineCategory } from "@/types/medical";

// to clean wrong markdown
function cleanJsonString(rawString: string): string {
    let cleaned = rawString.trim();
    if (cleaned.startsWith("```")) {
        cleaned = cleaned
            .replace(/^```json/, "")
            .replace(/^```/, "")
            .trim();
    }
    return cleaned;
}

export async function parseMedicalDocument(
    documentText: string,
    patientId: string,
): Promise<{ success: boolean; data?: MedicalRecord; error?: string }> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return {
            success: false,
            error: "System Configuration Error: GEMINI_API_KEY is missing on server environment variables.",
        };
    }

    // system prompt
    const systemPrompt = `
    You are an expert Clinical Intelligence AI Parser. Your task is to extract medical data from the provided raw text or prescription scan and return a valid JSON object matching the exact JSON schema provided below.
    Do not include any introductory sentences, markdown code block wrappers (like \`\`\`json), or conversational text. Output ONLY the raw valid JSON string.

    CRITICAL RULES FOR EXTRACTION:
    1. Medicine Category Mapping: You must categorize each extracted medicine into one of these exact string values: 'Antibiotic', 'Vitamin', 'Calcium', 'Gastric', or 'Other'.
    2. Empty Values: If certain fields (like respiratoryRate or bloodPressure) are completely missing from the text, default them to "Not Available".
    3. Test Values: Always pair the diagnostic test name with its numerical value or observed state clearly.

    REQUIRED JSON OUTPUT SCHEMA FORMAT:
    {
      "recordId": "GEN-UUID", 
      "patientId": "${patientId}",
      "date": "YYYY-MM-DD format based on consultation date (if missing use current date 2026-06-17)",
      "doctorName": "Doctor's name with prefix Dr.",
      "patientCase": "Comprehensive breakdown of patient complaints/symptoms summary",
      "respiratoryRate": "Value in bpm (e.g., '18 bpm')",
      "bloodPressure": "Value in mmHg (e.g., '120/80')",
      "medicines": [
        {
          "name": "Full medicine name",
          "dosage": "Dosage parameters (e.g., '1+0+1' or '500mg')",
          "duration": "Duration specified (e.g., '7 days')",
          "category": "Must be exactly one of: 'Antibiotic' | 'Vitamin' | 'Calcium' | 'Gastric' | 'Other'"
        }
      ],
      "testResults": [
        {
          "testName": "Name of clinical laboratory test",
          "value": "Numerical result with metric units or state flag"
        }
      ]
    }
  `;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: systemPrompt },
                                {
                                    text: `RAW MEDICAL DOCUMENT FOR EXTRACTION:\n\n${documentText}`,
                                },
                            ],
                        },
                    ],
                }),
            },
        );

        if (!response.ok) {
            return {
                success: false,
                error: `Gemini Engine Gate Error: Status code ${response.status}`,
            };
        }
        const jsonRes = await response.json();
        const rawAiText = jsonRes?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawAiText) {
            return {
                success: false,
                error: "AI Engine returned an unparseable or empty token payload.",
            };
        }

        const sanitizedJsonString = cleanJsonString(rawAiText);
        const parsedRecord: MedicalRecord = JSON.parse(sanitizedJsonString);

        // unique id for medical record
        parsedRecord.recordId = `REC-${Math.floor(100000 + Math.random() * 900000)}`;

        return { success: true, data: parsedRecord };
    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Something went wrong";
        return {
            success: false,
            error:
                errorMessage ||
                "An unhandled crash occured within the AI middleware channel.",
        };
    }
}
