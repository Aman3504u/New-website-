
import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeWebsite(targetUrl: string): Promise<ScanResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a maximum-depth cyber-reconnaissance and technical audit of: ${targetUrl}. 
      I need an exhaustive dataset. 
      Include:
      1. Core: IP, Location, Provider, tech stack.
      2. Infrastructure: Open ports, SSL issuer, WHOIS (created, expiry, registrar), CDN provider.
      3. Security: Security headers (HSTS, CSP, X-Frame-Options), known CVE vulnerabilities, subdomains, MX records.
      4. Performance: Response time, estimated page size, traffic volume.
      5. Global: Estimated DNS propagation status across North America, Europe, Asia, and Oceania.
      6. DDoS: Resilience score (0-100).

      Return a VALID JSON object matching this schema:
      {
        "url": "string",
        "ipAddress": "string",
        "serverLocation": "string",
        "hostingProvider": "string",
        "techStack": ["string"],
        "performanceScore": number,
        "loadInfo": { "avgResponseTime": "string", "trafficVolume": "string", "serverStatus": "string", "pageSize": "string" },
        "securityAnalysis": "string",
        "summary": "string",
        "sslDetails": "string",
        "mxRecords": ["string"],
        "subdomains": ["string"],
        "vulnerabilities": ["string"],
        "ddosResilience": number,
        "openPorts": ["string"],
        "cdnProvider": "string",
        "dnsPropagation": [{"region": "string", "status": "resolved"}],
        "securityHeaders": [{"name": "string", "status": "present" | "missing"}],
        "globalNodes": ["string"],
        "whoisData": { "created": "string", "expiry": "string", "registrar": "string" }
      }`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const jsonStr = response.text || "{}";
    const data = JSON.parse(jsonStr.replace(/```json|```/g, "").trim());
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Intelligence Node",
      uri: chunk.web?.uri || "#"
    })) || [];

    return {
      ...data,
      sources
    } as ScanResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Target firewall or network protocols blocked the request. Verify URL integrity.");
  }
}
