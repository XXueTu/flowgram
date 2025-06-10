import { createRoot } from "react-dom/client";
import App from "./app";
import "./index.less";

// 开发环境下自动设置默认token，确保菜单正常显示
if (process.env.NODE_ENV === 'development') {
  const existingToken = localStorage.getItem("token");
  if (!existingToken) {
    localStorage.setItem("token", "default-token");
    console.log("🚀 开发模式：已设置默认token");
  }
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Root element not found");
}
