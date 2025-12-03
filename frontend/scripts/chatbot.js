// =============== Chatbot (KSA tourism–only, backend-protected) ===============

// basic chat selectors
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

// ---------------- Backend setup (no API key here) ----------------
const BACKEND_URL = "https://api.visitsaudia.tech/api/chat";

// Concurrency guard
let REQUEST_IN_FLIGHT = false;

// Max user message length sent to backend (to avoid huge payloads)
const MAX_USER_CONTENT_CHARS = 6000;

const initialInputHeight = messageInput ? messageInput.scrollHeight : 0;

// Debug toggle
const DEBUG = false; // set true to console.log request/response

// ---------------- Helpers ----------------
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------- Call backend (instead of OpenRouter directly) ----------------
async function callBackend(userText) {
  const body = {
    message: userText.slice(0, MAX_USER_CONTENT_CHARS),
  };

  if (DEBUG) console.log("REQUEST →", body);

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();
  if (DEBUG) console.log("RESPONSE ←", data);
  return data;
}

// ---------------- API call wrapper ----------------
const generateBotResponse = async (incomingMessageDiv, userText) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");

  try {
    REQUEST_IN_FLIGHT = true;

    const data = await callBackend(userText);

    if (!data || data.success === false) {
      const errorMsg =
        data?.error ||
        "حدث خطأ في الخادم، حاول مرة أخرى بعد قليل.";
      messageElement.textContent = errorMsg;
      messageElement.style.color = "#ff0000";
      return;
    }

    let apiResponseText = (data.reply || "").trim();
    if (!apiResponseText) apiResponseText = "(No response)";

    // With CSS .message-text { white-space: pre-wrap; } this keeps paragraphs
    messageElement.textContent = apiResponseText;
  } catch (error) {
    console.error(error);
    messageElement.textContent =
      "الخدمة مشغولة الآن أو تم استهلاك الحصة مؤقتاً. حاول بعد لحظات أو قلّل طول الرسالة.";
    messageElement.style.color = "#ff0000";
  } finally {
    REQUEST_IN_FLIGHT = false;
    incomingMessageDiv.classList.remove("thinking");
    chatBody?.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
};

// ---------------- UI handlers (prompt-only) ----------------
const handleOutgoingMessage = (e) => {
  e.preventDefault();
  const text = messageInput?.value?.trim();
  if (!text) return;

  if (REQUEST_IN_FLIGHT) {
    const notice = createMessageElement(
      `<div class="message-text">الطلب السابق قيد المعالجة… انتظر ثوانٍ ثم أعد الإرسال.</div>`,
      "bot-message"
    );
    chatBody?.appendChild(notice);
    chatBody?.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    return;
  }

  const outgoingMessageDiv = createMessageElement(
    `<div class="message-text"></div>`,
    "user-message"
  );
  outgoingMessageDiv.querySelector(".message-text").textContent = text;
  chatBody?.appendChild(outgoingMessageDiv);
  chatBody?.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  if (messageInput) {
    messageInput.value = "";
    messageInput.dispatchEvent(new Event("input"));
  }

  const botMsgHTML = `
    <img style="width: 50px; border-radius: 1000px;" src="../assets/icons/chatbot-icon.png" alt="">
    <div class="message-text">
      <div class="thinking-indicator">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
      </div>
    </div>
  `;
  const incomingMessageDiv = createMessageElement(
    botMsgHTML,
    "bot-message",
    "thinking"
  );
  chatBody?.appendChild(incomingMessageDiv);
  chatBody?.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  generateBotResponse(incomingMessageDiv, text);
};

// send on Enter (desktop) without Shift
if (messageInput) {
  messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (
      e.key === "Enter" &&
      userMessage &&
      !e.shiftKey &&
      window.innerWidth > 768
    ) {
      handleOutgoingMessage(e);
    }
  });

  // auto-resize textarea
  messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    const chatForm = document.querySelector(".chat-form");
    if (chatForm) {
      chatForm.style.borderRadius =
        messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
    }
  });
}

// send button
if (sendMessageButton) {
  sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
}

// open/close chatbot
if (chatbotToggler) {
  chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
  });
}
if (closeChatbot) {
  closeChatbot.addEventListener("click", () => {
    document.body.classList.remove("show-chatbot");
  });
}
