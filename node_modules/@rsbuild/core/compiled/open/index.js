(() => {
  var __webpack_modules__ = {
    932: (module) => {
      "use strict";
      module.exports = (object, propertyName, fn) => {
        const define = (value) =>
          Object.defineProperty(object, propertyName, {
            value,
            enumerable: true,
            writable: true,
          });
        Object.defineProperty(object, propertyName, {
          configurable: true,
          enumerable: true,
          get() {
            const result = fn();
            define(result);
            return result;
          },
          set(value) {
            define(value);
          },
        });
        return object;
      };
    },
    293: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const fs = __nccwpck_require__(896);
      let isDocker;
      function hasDockerEnv() {
        try {
          fs.statSync("/.dockerenv");
          return true;
        } catch (_) {
          return false;
        }
      }
      function hasDockerCGroup() {
        try {
          return fs
            .readFileSync("/proc/self/cgroup", "utf8")
            .includes("docker");
        } catch (_) {
          return false;
        }
      }
      module.exports = () => {
        if (isDocker === undefined) {
          isDocker = hasDockerEnv() || hasDockerCGroup();
        }
        return isDocker;
      };
    },
    622: (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      const os = __nccwpck_require__(857);
      const fs = __nccwpck_require__(896);
      const isDocker = __nccwpck_require__(293);
      const isWsl = () => {
        if (process.platform !== "linux") {
          return false;
        }
        if (os.release().toLowerCase().includes("microsoft")) {
          if (isDocker()) {
            return false;
          }
          return true;
        }
        try {
          return fs
            .readFileSync("/proc/version", "utf8")
            .toLowerCase()
            .includes("microsoft")
            ? !isDocker()
            : false;
        } catch (_) {
          return false;
        }
      };
      if (process.env.__IS_WSL_TEST__) {
        module.exports = isWsl;
      } else {
        module.exports = isWsl();
      }
    },
    820: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const path = __nccwpck_require__(928);
      const childProcess = __nccwpck_require__(317);
      const { promises: fs, constants: fsConstants } = __nccwpck_require__(896);
      const isWsl = __nccwpck_require__(622);
      const isDocker = __nccwpck_require__(293);
      const defineLazyProperty = __nccwpck_require__(932);
      const localXdgOpenPath = __nccwpck_require__.ab + "xdg-open";
      const { platform, arch } = process;
      const hasContainerEnv = () => {
        try {
          fs.statSync("/run/.containerenv");
          return true;
        } catch {
          return false;
        }
      };
      let cachedResult;
      function isInsideContainer() {
        if (cachedResult === undefined) {
          cachedResult = hasContainerEnv() || isDocker();
        }
        return cachedResult;
      }
      const getWslDrivesMountPoint = (() => {
        const defaultMountPoint = "/mnt/";
        let mountPoint;
        return async function () {
          if (mountPoint) {
            return mountPoint;
          }
          const configFilePath = "/etc/wsl.conf";
          let isConfigFileExists = false;
          try {
            await fs.access(configFilePath, fsConstants.F_OK);
            isConfigFileExists = true;
          } catch {}
          if (!isConfigFileExists) {
            return defaultMountPoint;
          }
          const configContent = await fs.readFile(configFilePath, {
            encoding: "utf8",
          });
          const configMountPoint = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(
            configContent,
          );
          if (!configMountPoint) {
            return defaultMountPoint;
          }
          mountPoint = configMountPoint.groups.mountPoint.trim();
          mountPoint = mountPoint.endsWith("/") ? mountPoint : `${mountPoint}/`;
          return mountPoint;
        };
      })();
      const pTryEach = async (array, mapper) => {
        let latestError;
        for (const item of array) {
          try {
            return await mapper(item);
          } catch (error) {
            latestError = error;
          }
        }
        throw latestError;
      };
      const baseOpen = async (options) => {
        options = {
          wait: false,
          background: false,
          newInstance: false,
          allowNonzeroExitCode: false,
          ...options,
        };
        if (Array.isArray(options.app)) {
          return pTryEach(options.app, (singleApp) =>
            baseOpen({ ...options, app: singleApp }),
          );
        }
        let { name: app, arguments: appArguments = [] } = options.app || {};
        appArguments = [...appArguments];
        if (Array.isArray(app)) {
          return pTryEach(app, (appName) =>
            baseOpen({
              ...options,
              app: { name: appName, arguments: appArguments },
            }),
          );
        }
        let command;
        const cliArguments = [];
        const childProcessOptions = {};
        if (platform === "darwin") {
          command = "open";
          if (options.wait) {
            cliArguments.push("--wait-apps");
          }
          if (options.background) {
            cliArguments.push("--background");
          }
          if (options.newInstance) {
            cliArguments.push("--new");
          }
          if (app) {
            cliArguments.push("-a", app);
          }
        } else if (
          platform === "win32" ||
          (isWsl && !isInsideContainer() && !app)
        ) {
          const mountPoint = await getWslDrivesMountPoint();
          command = isWsl
            ? `${mountPoint}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe`
            : `${process.env.SYSTEMROOT}\\System32\\WindowsPowerShell\\v1.0\\powershell`;
          cliArguments.push(
            "-NoProfile",
            "-NonInteractive",
            "–ExecutionPolicy",
            "Bypass",
            "-EncodedCommand",
          );
          if (!isWsl) {
            childProcessOptions.windowsVerbatimArguments = true;
          }
          const encodedArguments = ["Start"];
          if (options.wait) {
            encodedArguments.push("-Wait");
          }
          if (app) {
            encodedArguments.push(`"\`"${app}\`""`, "-ArgumentList");
            if (options.target) {
              appArguments.unshift(options.target);
            }
          } else if (options.target) {
            encodedArguments.push(`"${options.target}"`);
          }
          if (appArguments.length > 0) {
            appArguments = appArguments.map((arg) => `"\`"${arg}\`""`);
            encodedArguments.push(appArguments.join(","));
          }
          options.target = Buffer.from(
            encodedArguments.join(" "),
            "utf16le",
          ).toString("base64");
        } else {
          if (app) {
            command = app;
          } else {
            const isBundled = !__dirname || __dirname === "/";
            let exeLocalXdgOpen = false;
            try {
              await fs.access(
                __nccwpck_require__.ab + "xdg-open",
                fsConstants.X_OK,
              );
              exeLocalXdgOpen = true;
            } catch {}
            const useSystemXdgOpen =
              process.versions.electron ||
              platform === "android" ||
              isBundled ||
              !exeLocalXdgOpen;
            command = useSystemXdgOpen ? "xdg-open" : localXdgOpenPath;
          }
          if (appArguments.length > 0) {
            cliArguments.push(...appArguments);
          }
          if (!options.wait) {
            childProcessOptions.stdio = "ignore";
            childProcessOptions.detached = true;
          }
        }
        if (options.target) {
          cliArguments.push(options.target);
        }
        if (platform === "darwin" && appArguments.length > 0) {
          cliArguments.push("--args", ...appArguments);
        }
        const subprocess = childProcess.spawn(
          command,
          cliArguments,
          childProcessOptions,
        );
        if (options.wait) {
          return new Promise((resolve, reject) => {
            subprocess.once("error", reject);
            subprocess.once("close", (exitCode) => {
              if (!options.allowNonzeroExitCode && exitCode > 0) {
                reject(new Error(`Exited with code ${exitCode}`));
                return;
              }
              resolve(subprocess);
            });
          });
        }
        subprocess.unref();
        return subprocess;
      };
      const open = (target, options) => {
        if (typeof target !== "string") {
          throw new TypeError("Expected a `target`");
        }
        return baseOpen({ ...options, target });
      };
      const openApp = (name, options) => {
        if (typeof name !== "string") {
          throw new TypeError("Expected a `name`");
        }
        const { arguments: appArguments = [] } = options || {};
        if (
          appArguments !== undefined &&
          appArguments !== null &&
          !Array.isArray(appArguments)
        ) {
          throw new TypeError("Expected `appArguments` as Array type");
        }
        return baseOpen({ ...options, app: { name, arguments: appArguments } });
      };
      function detectArchBinary(binary) {
        if (typeof binary === "string" || Array.isArray(binary)) {
          return binary;
        }
        const { [arch]: archBinary } = binary;
        if (!archBinary) {
          throw new Error(`${arch} is not supported`);
        }
        return archBinary;
      }
      function detectPlatformBinary({ [platform]: platformBinary }, { wsl }) {
        if (wsl && isWsl) {
          return detectArchBinary(wsl);
        }
        if (!platformBinary) {
          throw new Error(`${platform} is not supported`);
        }
        return detectArchBinary(platformBinary);
      }
      const apps = {};
      defineLazyProperty(apps, "chrome", () =>
        detectPlatformBinary(
          {
            darwin: "google chrome",
            win32: "chrome",
            linux: ["google-chrome", "google-chrome-stable", "chromium"],
          },
          {
            wsl: {
              ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
              x64: [
                "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe",
                "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
              ],
            },
          },
        ),
      );
      defineLazyProperty(apps, "firefox", () =>
        detectPlatformBinary(
          {
            darwin: "firefox",
            win32: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
            linux: "firefox",
          },
          { wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe" },
        ),
      );
      defineLazyProperty(apps, "edge", () =>
        detectPlatformBinary(
          {
            darwin: "microsoft edge",
            win32: "msedge",
            linux: ["microsoft-edge", "microsoft-edge-dev"],
          },
          {
            wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
          },
        ),
      );
      open.apps = apps;
      open.openApp = openApp;
      module.exports = open;
    },
    317: (module) => {
      "use strict";
      module.exports = require("child_process");
    },
    896: (module) => {
      "use strict";
      module.exports = require("fs");
    },
    857: (module) => {
      "use strict";
      module.exports = require("os");
    },
    928: (module) => {
      "use strict";
      module.exports = require("path");
    },
  };
  var __webpack_module_cache__ = {};
  function __nccwpck_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (__webpack_module_cache__[moduleId] = { exports: {} });
    var threw = true;
    try {
      __webpack_modules__[moduleId](
        module,
        module.exports,
        __nccwpck_require__,
      );
      threw = false;
    } finally {
      if (threw) delete __webpack_module_cache__[moduleId];
    }
    return module.exports;
  }
  if (typeof __nccwpck_require__ !== "undefined")
    __nccwpck_require__.ab = __dirname + "/";
  var __webpack_exports__ = __nccwpck_require__(820);
  module.exports = __webpack_exports__;
})();
