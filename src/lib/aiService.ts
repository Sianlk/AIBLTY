import { supabase } from "@/integrations/supabase/client";

export type AIMode = 
  | "general" 
  | "solver" 
  | "builder" 
  | "research" 
  | "automation" 
  | "quantum" 
  | "revenue" 
  | "workforce";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  success: boolean;
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
}

export async function sendAIMessage(
  messages: Message[],
  mode: AIMode = "general"
): Promise<AIResponse> {
  try {
    const { data, error } = await supabase.functions.invoke("ai-chat", {
      body: { messages, mode, stream: false },
    });

    if (error) {
      console.error("AI function error:", error);
      return { 
        success: false, 
        content: "", 
        error: error.message || "Failed to connect to AI service" 
      };
    }

    if (data?.error) {
      return { 
        success: false, 
        content: "", 
        error: data.error 
      };
    }

    return {
      success: true,
      content: data.content,
      usage: data.usage,
    };
  } catch (err) {
    console.error("AI service error:", err);
    return {
      success: false,
      content: "",
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

export async function streamAIMessage(
  messages: Message[],
  mode: AIMode = "general",
  onDelta: (text: string) => void,
  onDone: () => void,
  onError?: (error: string) => void
): Promise<void> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages, mode, stream: true }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }

    onDone();
  } catch (error) {
    console.error("Stream error:", error);
    onError?.(error instanceof Error ? error.message : "Stream failed");
  }
}
