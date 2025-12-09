import { supabase } from "@/integrations/supabase/client";

export type AIMode = 
  | "general" 
  | "solver" 
  | "builder" 
  | "research" 
  | "automation" 
  | "quantum" 
  | "revenue" 
  | "workforce"
  | "marketing"
  | "social"
  | "evolution"
  | "security"
  | "network"
  | "integrations"
  | "insights";

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
  upgrade_required?: boolean;
}

export async function sendAIMessage(
  messages: Message[],
  mode: AIMode = "general"
): Promise<AIResponse> {
  try {
    // Check if user is authenticated first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error("No active session:", sessionError);
      return { 
        success: false, 
        content: "", 
        error: "Please sign in to use AI features. Click 'Get Started' to create an account or log in." 
      };
    }

    // Validate messages
    if (!messages || messages.length === 0) {
      return { 
        success: false, 
        content: "", 
        error: "No message provided" 
      };
    }

    console.log("Sending AI request:", { mode, messageCount: messages.length });

    const { data, error } = await supabase.functions.invoke("ai-chat", {
      body: { messages, mode, stream: false },
    });

    if (error) {
      console.error("AI function error:", error);
      
      // Handle specific error types
      if (error.message?.includes("401") || error.message?.includes("auth")) {
        return { 
          success: false, 
          content: "", 
          error: "Session expired. Please sign in again." 
        };
      }
      
      return { 
        success: false, 
        content: "", 
        error: error.message || "Failed to connect to AI service. Please try again." 
      };
    }

    // Handle API-level errors
    if (data?.error) {
      console.error("AI API error:", data.error);
      return { 
        success: false, 
        content: "", 
        error: data.error,
        upgrade_required: data.upgrade_required || false
      };
    }

    // Validate response content
    if (!data?.content) {
      console.error("No content in AI response:", data);
      return {
        success: false,
        content: "",
        error: "AI returned an empty response. Please try again."
      };
    }

    console.log("AI response received successfully");

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
      error: err instanceof Error ? err.message : "An unexpected error occurred. Please try again.",
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
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      onError?.("Please sign in to use AI features.");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages, mode, stream: true }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        onError?.("Session expired. Please sign in again.");
        return;
      }
      if (response.status === 429) {
        onError?.(errorData.error || "Daily limit reached. Upgrade for more AI queries.");
        return;
      }
      
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
    onError?.(error instanceof Error ? error.message : "Stream failed. Please try again.");
  }
}
