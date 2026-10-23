// Inject the bundle, configuration, then this file before any course script.
(function () {
  function send(message) {
    var json = JSON.stringify(message);
    var handlers = window.webkit && window.webkit.messageHandlers;
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(json);
    else if (handlers && handlers.scormBridge) handlers.scormBridge.postMessage(json);
    else if (handlers && handlers.csharpBridge) handlers.csharpBridge.postMessage(json);
    else if (window.AndroidBridge) window.AndroidBridge.postMessage(json);
    else if (window.ScormBridge) window.ScormBridge.postMessage(json);
    else if (window.CSharpBridge) window.CSharpBridge.postMessage(json);
  }

  var config = window.scormBridgeConfig;
  if (!config || (config.version !== "1.2" && config.version !== "2004")) {
    throw new Error("Set scormBridgeConfig.version to 1.2 or 2004");
  }
  var settings = {};
  var key;
  for (key in config.settings) {
    if (Object.prototype.hasOwnProperty.call(config.settings, key)) {
      settings[key] = config.settings[key];
    }
  }
  settings.onLogMessage = function (level, message) {
    send({ type: "log", level: Number(level), message: String(message) });
  };
  var is12 = config.version === "1.2";
  var api = is12 ? new window.Scorm12API(settings) : new window.Scorm2004API(settings);
  var events = is12
    ? ["LMSInitialize", "LMSCommit", "LMSFinish"]
    : ["Initialize", "Commit", "Terminate"];
  events.forEach(function (name) {
    api.on(name, function (element, value) {
      send({ type: "event", name: name, CMIElement: element, value: value });
    });
  });
  api.on("CommitError", function (errorCode, context) {
    send({ type: "event", name: "CommitError", errorCode: errorCode, context: context });
  });
  ["OfflineDataSyncing", "OfflineDataSynced", "OfflineDataSyncFailed"].forEach(function (name) {
    api.on(name, function () {
      send({ type: "event", name: name });
    });
  });
  if (config.cmi) api.loadFromJSON(config.cmi);
  if (is12) window.API = api;
  else window.API_1484_11 = api;
})();
