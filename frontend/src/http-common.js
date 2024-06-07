import axios from "axios";

export default axios.create({
  baseURL: "http://54.157.51.139:3000/api",
  headers: {
    "Content-type": "application/json"
  }
});