// services/aiService.js
import api from "./api";

const aiService = {
  chat: (message, pnr = null) => {
    return api.post("/ai/chat", { message, pnr });
  },
};

export default aiService;
