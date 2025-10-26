import { ERROR_TIMEOUT, MESSAGE_TIMEOUT } from "@/constants/profile.constants";
import { MessageState } from "@/types/profile.types";
import { useState, useCallback } from "react";

export const useMessages = () => {
  const [messages, setMessages] = useState<MessageState>({
    success: "",
    error: "",
  });

  const showSuccess = useCallback((message: string) => {
    setMessages((prev) => ({ ...prev, success: message, error: "" }));
    setTimeout(() => {
      setMessages((prev) => ({ ...prev, success: "" }));
    }, MESSAGE_TIMEOUT);
  }, []);

  const showError = useCallback((message: string) => {
    setMessages((prev) => ({ ...prev, error: message, success: "" }));
    setTimeout(() => {
      setMessages((prev) => ({ ...prev, error: "" }));
    }, ERROR_TIMEOUT);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages({ success: "", error: "" });
  }, []);

  return { messages, showSuccess, showError, clearMessages };
};
