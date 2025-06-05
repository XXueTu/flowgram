import { createRoot } from "react-dom/client";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

// 配置 Monaco Editor 使用本地安装的 monaco-editor 包
loader.config({ monaco });

import { Editor } from "./editor";

const app = createRoot(document.getElementById("root")!);

app.render(<Editor />);
