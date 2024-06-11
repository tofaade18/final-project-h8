import axios from "axios";

export default axios.create({
  baseURL: "https://group-connection.handuktangerang.online/api",
  headers: {
    "Content-type": "application/json"
  }
});