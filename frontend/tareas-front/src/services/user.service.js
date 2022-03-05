import axios from "axios";

const request = axios.create({
  baseURL: `${process.env.REACT_APP_BACKUP_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getServerInfo = () => {
  return request.get("/status");
};