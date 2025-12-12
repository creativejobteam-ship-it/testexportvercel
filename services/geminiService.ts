

import { GoogleGenAI, Type } from "@google/genai";
import { Message, QuestionnaireData, BriefResponse, GeneratedStrategy, ActionPlan, QuestionDefinition, AuditResult, Strategy } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// Using 2.5 flash for fast tasks, 3.0 pro preview for complex reasoning
const FAST_MODEL = 'gemini-2.5-flash';
const REASONING_MODEL = 'gemini-3-pro-preview';

// Analyze sentiment of a message
export const analyzeSentiment = async (text: string): Promise<{ sentiment: 'positive' | 'neutral' | 'negative', confidence: number }> => {
  try {
    const prompt = `Analyze the sentiment of the following social media message. Return JSON with 'sentiment' (positive, neutral, or negative) and 'confidence' (0 to 1). Message: "${text}"`;
    
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, enum: ['positive', 'neutral', 'negative'] },
            confidence: { type: Type.NUMBER }
          },
          required: ['sentiment', 'confidence']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Sentiment analysis failed", error);
    return { sentiment: 'neutral', confidence: 0.5 };
  }
};

// Generate a polite reply
export const generateReply = async (message: Message): Promise<string> => {
  try {
    const prompt = `You are an expert community manager for a SaaS platform. Write a polite, professional, and helpful reply to this user message from ${message.platform}. Keep it under 280 characters if the platform is Twitter.
    
    User Message: "${message.content}"
    
    Reply:`;

    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
    });

    return response.text || "Could not generate reply.";
  } catch (error) {
    console.error("Reply generation failed", error);
    return "Thank you for your message. We will get back to you shortly.";
  }
};

// Generate a new social media post
export const generatePostContent = async (topic: string, platform: string): Promise<string> => {
  try {
    const prompt = `Write a catchy, engaging social media post about "${topic}" for ${platform}. Include relevant emojis and hashtags.`;
    
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Post generation failed", error);
    return `Exciting news about ${topic}! Stay tuned.`;
  }
};

// Generate Marketing Strategy
export const generateMarketingStrategy = async (brandData: any): Promise<any> => {
  try {
    const prompt = `Create a comprehensive digital marketing strategy for the following brand:
    Name: ${brandData.name}
    Website: ${brandData.website}
    Tone: ${brandData.tone}
    Target Audience: ${brandData.audience}
    Objectives: ${brandData.objectives}
    Competitors: ${brandData.competitors}
    Resources Available: ${brandData.resources}
    
    Output strictly valid JSON with the following structure:
    {
      "executive_summary": "string",
      "content_pillars": ["string", "string", "string"],
      "posting_schedule": { "frequency": "string", "best_times": "string" },
      "recommended_platforms": ["string"],
      "growth_tactics": ["string"]
    }`;
    
    const response = await ai.models.generateContent({
      model: REASONING_MODEL, // Using reasoning model for strategy
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Strategy generation failed", error);
    return {
        executive_summary: "Could not generate strategy at this time.",
        content_pillars: ["Educational Content", "Product Updates", "Community Spotlights"],
        posting_schedule: { frequency: "3x per week", best_times: "10am EST" },
        recommended_platforms: ["Twitter", "LinkedIn"],
        growth_tactics: ["Engage with influencers", "Host webinars"]
    };
  }
};

// Generate Strategy from Client Questionnaire (Legacy)
export const generateStrategyFromQuestionnaire = async (data: QuestionnaireData): Promise<any> => {
  try {
    const prompt = `Act as a senior digital marketing strategist. Based on the following client briefing, generate a detailed marketing strategy.

    Client Briefing:
    - Business Objectives & KPIs: ${data.objectives} (KPIs: ${data.kpis})
    - Target Audience (Personas): ${data.targets}
    - Competitive Analysis: ${data.competitors}
    - Available Resources: ${data.resources}

    Please generate a JSON response with the following structure:
    {
      "editorial_strategy": "Detailed editorial strategy description...",
      "content_pillars": [
        { "title": "Pillar Title", "description": "Description of the content pillar" },
        { "title": "Pillar Title", "description": "Description of the content pillar" }
      ],
      "planning": [
        { "week": 1, "theme": "Theme of the week", "activities": ["Activity 1", "Activity 2"] },
        { "week": 2, "theme": "Theme of the week", "activities": ["Activity 1", "Activity 2"] },
        { "week": 3, "theme": "Theme of the week", "activities": ["Activity 1", "Activity 2"] },
        { "week": 4, "theme": "Theme of the week", "activities": ["Activity 1", "Activity 2"] }
      ]
    }`;
    
    const response = await ai.models.generateContent({
      model: REASONING_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Client Strategy generation failed", error);
    return {
        editorial_strategy: "Error generating strategy. Please try again.",
        content_pillars: [],
        planning: []
    };
  }
};

// --- Advanced Strategy Generation with Audit Data ---

export const generateStrategyFromContext = async (
    brief: BriefResponse | undefined, 
    auditResults: Record<string, AuditResult> | undefined
): Promise<GeneratedStrategy> => {
  try {
    const briefAnswers = brief ? Object.entries(brief.answers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n') : "No brief provided.";

    const auditSummary = auditResults ? Object.values(auditResults)
      .map(r => `Agent [${r.workflowType}]: ${r.summary}`)
      .join('\n') : "No audit data provided.";

    const prompt = `Act as a world-class Chief Marketing Officer. 
    Construct a HIGH-LEVEL Marketing Strategy based on the following input data.
    
    DATA SOURCE 1: CLIENT BRIEFING
    ${briefAnswers}

    DATA SOURCE 2: AI AUDIT INTELLIGENCE (Real-time data)
    ${auditSummary}

    CRITICAL INSTRUCTION: You must synthesize the Audit Intelligence into the strategy. 
    For example, if the audit mentions a specific competitor weakness, address it in the executive summary or tactics.

    Generate a JSON response matching the following schema exactly:
    {
      "executiveSummary": "string (4-5 sentences blending client goals with audit findings)",
      "targetAudienceAnalysis": "string (refined persona based on brief)",
      "contentPillars": [
        { "title": "string", "description": "string", "keywords": ["string"] }
      ],
      "toneOfVoice": "string",
      "platformStrategy": [
        { "platform": "string", "frequency": "string", "formatFocus": "string" }
      ]
    }
    `;

    const response = await ai.models.generateContent({
      model: REASONING_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      id: Date.now().toString(),
      briefResponseId: brief?.id || 'unknown',
      ...result,
      isApproved: false,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error("generateStrategyFromContext failed", error);
    throw error;
  }
};

export const generateStrategyFromBrief = async (brief: BriefResponse): Promise<GeneratedStrategy> => {
    // Fallback wrapper for legacy calls
    return generateStrategyFromContext(brief, undefined);
};

export const generateActionPlan = async (strategy: GeneratedStrategy | Strategy): Promise<ActionPlan> => {
  try {
    const strategyContext = JSON.stringify(strategy);
    const prompt = `Based on the following Marketing Strategy, generate a concrete, actionable 4-week Action Plan with specific tasks.
    
    STRATEGY CONTEXT:
    ${strategyContext}

    Generate a JSON response matching:
    {
      "tasks": [
        { 
          "title": "string", 
          "description": "string", 
          "priority": "high" | "medium" | "low",
          "dueDate": "string (formatted as 'Week X - Day Y')",
          "status": "pending"
        }
      ]
    }
    `;

    const response = await ai.models.generateContent({
      model: REASONING_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const result = JSON.parse(response.text || '{"tasks": []}');
    
    const tasksWithIds = result.tasks.map((t: any) => ({
      ...t,
      task: t.title, // Map title to task for internal consistency
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending'
    }));

    // Handle different ID structures based on input type
    const strategyId = (strategy as any).id || Date.now().toString();

    return {
      id: Date.now().toString(),
      strategyId: strategyId,
      tasks: tasksWithIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error("generateActionPlan failed", error);
    throw error;
  }
};

export const generateBriefingQuestions = async (domainName: string, description: string): Promise<QuestionDefinition[]> => {
    try {
        const prompt = `
        You are an expert strategist. Create a list of 5 specific, high-value briefing questions to ask a client in the "${domainName}" industry. 
        Context: ${description}.
        
        The questions should be specific to this industry (e.g., if restaurant, ask about cuisine; if SaaS, ask about product stage).
        
        Return a JSON object with a "questions" array. Each question must match this schema:
        {
            "id": "string (unique snake_case slug)",
            "label": "string (Question text)",
            "type": "text" | "textarea" | "select" | "multi-select",
            "options": ["string"] (required only for select/multi-select),
            "placeholder": "string (example answer)",
            "required": boolean,
            "order": number (start at 20),
            "section": "Specific"
        }
        `;

        const response = await ai.models.generateContent({
            model: FAST_MODEL,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const result = JSON.parse(response.text || '{ "questions": [] }');
        return result.questions || [];

    } catch (error) {
        console.error("generateBriefingQuestions failed", error);
        return [];
    }
};

// --- CONSOLIDATED RESEARCH (Global Cache) ---

export const runConsolidatedResearch = async (context: any): Promise<string> => {
    try {
        const contextStr = JSON.stringify(context);
        const prompt = `
        Act as a Senior Market Intelligence Analyst. Perform a deep, consolidated research sweep for the following project:
        PROJECT CONTEXT: ${contextStr}

        You must use Google Search to find real, up-to-date information. 
        Gather data for the following 5 dimensions:

        1. COMPETITIVE LANDSCAPE: Identify top 3 direct competitors. Find their strengths, weaknesses, and key marketing channels.
        2. MARKET ANALYSIS: Current market size, growth trends, and target audience demographics.
        3. SEO INTELLIGENCE: High-volume transactional keywords and content gaps in this niche.
        4. EMERGING TRENDS: What is trending *right now* in this sector? (Viral topics, new tech, consumer shifts).
        5. TECHNICAL BENCHMARKS: Standard web performance and tech stack expectations for this industry.

        Compile this into a comprehensive "Global Research Report". 
        Structure it clearly with headers.
        `;

        const response = await ai.models.generateContent({
            model: REASONING_MODEL,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }] // Enable tool for this consolidated run
            }
        });

        return response.text || "Research generation failed.";

    } catch (error) {
        console.error("Consolidated research failed", error);
        throw error;
    }
};

// --- AUDIT WORKFLOW (GEMINI 3) ---

export const runAuditWorkflow = async (
    workflowType: string,
    briefContext: any,
    cachedResearch?: string // Optional cache
): Promise<AuditResult> => {
    try {
        let prompt = "";
        const contextStr = JSON.stringify(briefContext);
        
        // Construct prompt based on whether we have cache or need to search
        const baseInstructions = cachedResearch 
            ? `ACT as a Senior Analyst. Use the following RESEARCH REPORT as your primary source of truth. Do NOT hallucinate.
               RESEARCH REPORT:
               ${cachedResearch}
               
               Based on this report, generate the specific analysis below:`
            : `Analyze the following context: ${contextStr}.`;

        switch(workflowType) {
            // PHASE 1
            case 'competitive_analysis':
                prompt = `${baseInstructions} Identify 3 direct competitors. Analyze their strengths and weaknesses.
                Return JSON: { "summary": "string", "score": number (0-100), "sources": [{"title": "string", "url": "string"}], "tables": [{"title": "Competitor Matrix", "html": "<table>...</table>"}] }`;
                break;
            case 'market_analysis':
                prompt = `${baseInstructions} Market analysis for: ${contextStr}. Identify TAM/SAM/SOM.
                Return JSON: { "summary": "string", "score": number, "sources": [], "tables": [{"title": "Demographics", "html": "<table>...</table>"}] }`;
                break;
            case 'keyword_research':
                prompt = `${baseInstructions} Keyword strategy for: ${contextStr}. Focus on transactional intent.
                Return JSON: { "summary": "string", "score": number, "sources": [], "tables": [{"title": "Top Keywords", "html": "<table>...</table>"}] }`;
                break;
            case 'seo_audit':
                prompt = `${baseInstructions} Simulate SEO audit for: ${contextStr}. Identify technical issues based on industry standards.
                Return JSON: { "summary": "string", "score": number, "sources": [], "tables": [{"title": "SEO Issues", "html": "<table>...</table>"}] }`;
                break;
            case 'trend_analysis':
                prompt = `${baseInstructions} Identify emerging trends for: ${contextStr}.
                Return JSON: { "summary": "string", "score": number, "sources": [], "tables": [{"title": "Trend Watch", "html": "<table>...</table>"}] }`;
                break;
            
            // PHASE 2
            case 'deep_competitor_audit':
                prompt = `${baseInstructions} Deep dive into competitor content strategy for: ${contextStr}.
                Return JSON: { "summary": "string", "score": number, "sources": [], "tables": [{"title": "Content Gap", "html": "<table>...</table>"}] }`;
                break;
            case 'content_opportunities':
                prompt = `${baseInstructions} Identify 5 viral content opportunities for: ${contextStr}.
                Return JSON: { "summary": "string", "score": number, "sources": [], "tables": [{"title": "Content Ideas", "html": "<table>...</table>"}] }`;
                break;
            case 'backlink_analysis':
                prompt = `${baseInstructions} Analyze potential backlink sources for: ${contextStr}.
                Return JSON: { "summary": "string", "score": number, "sources": [], "tables": [{"title": "Outreach Targets", "html": "<table>...</table>"}] }`;
                break;
            case 'technical_audit':
                prompt = `${baseInstructions} Advanced technical audit (Speed, Mobile, Core Web Vitals) for: ${contextStr}.
                Return JSON: { "summary": "string", "score": number, "sources": [], "tables": [{"title": "Tech Fixes", "html": "<table>...</table>"}] }`;
                break;
            case 'strategic_recommendations':
                prompt = `${baseInstructions} Synthesize all findings into strategic recommendations for: ${contextStr}.
                Return JSON: { "summary": "string", "score": number, "sources": [], "tables": [{"title": "Roadmap", "html": "<table>...</table>"}] }`;
                break;
            default:
                prompt = `General analysis for ${contextStr}`;
        }

        // Only use Google Search tool if we DO NOT have cached research
        const tools = cachedResearch ? [] : [{ googleSearch: {} }];

        const response = await ai.models.generateContent({
            model: REASONING_MODEL,
            contents: prompt,
            config: {
                tools: tools,
                responseMimeType: "application/json"
            }
        });

        // Extract grounding chunks for sources (only if search was used)
        const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const webSources = grounding
            .map((chunk: any) => chunk.web ? { title: chunk.web.title, url: chunk.web.uri } : null)
            .filter((s: any) => s !== null);

        const resultData = JSON.parse(response.text || '{}');

        return {
            workflowType,
            summary: resultData.summary || "Analysis completed.",
            phase: ['competitive_analysis', 'market_analysis', 'keyword_research', 'seo_audit', 'trend_analysis'].includes(workflowType) ? 'phase_1' : 'phase_2',
            score: resultData.score,
            sources: resultData.sources || webSources, 
            tables: resultData.tables || [],
            status: 'completed',
            completedAt: new Date().toISOString()
        };

    } catch (error) {
        console.error(`Audit workflow ${workflowType} failed`, error);
        return {
            workflowType,
            summary: "Automated analysis failed. Please retry.",
            status: 'failed',
            completedAt: new Date().toISOString()
        };
    }
};

export const editImageWithGemini = async (imageBase64: string, promptText: string): Promise<string | null> => {
    try {
        const mimeType = imageBase64.split(';')[0].split(':')[1];
        const data = imageBase64.split(',')[1];
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { mimeType, data } },
                    { text: promptText }
                ]
            }
        });

        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (e) {
        console.error("Image edit failed", e);
        return null;
    }
};

export const analyzeImageWithGemini = async (imageBase64: string): Promise<string> => {
    try {
        const mimeType = imageBase64.split(';')[0].split(':')[1];
        const data = imageBase64.split(',')[1];

        const response = await ai.models.generateContent({
            model: REASONING_MODEL,
            contents: {
                parts: [
                    { inlineData: { mimeType, data } },
                    { text: "Analyze this image in detail. Describe the visual content, the context, potential emotions or sentiment, and suggest relevant tags or hashtags." }
                ]
            }
        });
        return response.text || "No analysis available.";
    } catch (e) {
        console.error("Analysis failed", e);
        return "Analysis failed. Please try again.";
    }
};

export const generateMemeCaptions = async (imageBase64: string): Promise<string[]> => {
    try {
        const mimeType = imageBase64.split(';')[0].split(':')[1];
        const data = imageBase64.split(',')[1];

        const response = await ai.models.generateContent({
            model: FAST_MODEL,
            contents: {
                parts: [
                    { inlineData: { mimeType, data } },
                    { text: "You are a creative meme generator. Analyze this image and generate 5 funny, witty, or viral-worthy meme captions for this image. Return ONLY a JSON array of strings, e.g. [\"caption 1\", \"caption 2\"]." }
                ]
            },
            config: {
                responseMimeType: "application/json"
            }
        });
        
        const text = response.text || "[]";
        const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Meme generation failed", e);
        return ["Error generating captions."];
    }
};