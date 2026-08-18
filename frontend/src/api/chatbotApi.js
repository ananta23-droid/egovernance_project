import axiosClient from "./axiosClient";

export const askChatbot = async (question) => {
  const res = await axiosClient.post("/chatbot/ask", { question });
  return res?.data?.data;
};