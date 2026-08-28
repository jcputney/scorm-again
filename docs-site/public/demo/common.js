function getSettingsFromParams(urlParams) {
  const settings = {
    autocommit: true,
    autocommitSeconds: 30,
    dataCommitFormat: 'json',
    commitRequestDataType: 'application/json;charset=UTF-8',
    autoProgress: false,
    logLevel: 1,
    mastery_override: false,
  };

  if (urlParams.get('autocommit') !== null) {
    settings.autocommit = (urlParams.get('autocommit') === 'true');
  }
  if (urlParams.get('autocommitSeconds') !== null) {
    let seconds = parseInt(urlParams.get('autocommitSeconds'));
    if (isNaN(seconds)) {
      seconds = 60; // default
    }
    settings.autocommitSeconds = seconds;
  }
  if (urlParams.get('dataCommitFormat') !== null) {
    const format = urlParams.get('dataCommitFormat');
    if (format !== null) {
      if (format === 'json' || format === 'params' || format === 'flattened') {
        settings.dataCommitFormat = format;
      }
    }
  }
  if (urlParams.get('logLevel') !== null) {
    let level = parseInt(urlParams.get('logLevel'));
    if (isNaN(level) || level < 1 || level > 5) {
      level = 4; // default
    }
    settings.logLevel = level;
  }

  return settings;
}

function rewireLoggingToElement() {
  fixLoggingFunc('lms');
  fixLoggingFunc('log');
  fixLoggingFunc('debug');
  fixLoggingFunc('warn');
  fixLoggingFunc('error');
  fixLoggingFunc('info');

  function fixLoggingFunc(name) {
    console['old' + name] = console[name];
    console[name] = function(...arguments) {
      const output = produceOutput(name, arguments);
      const eleLog = $('#log')[0];


      const eleContainerLog = $('#log-container')[0];
      const isScrolledToBottom = eleContainerLog.scrollHeight - eleContainerLog.clientHeight <= eleContainerLog.scrollTop + 1;
      eleLog.innerHTML += output + '<br>';
      if (isScrolledToBottom) {
        eleContainerLog.scrollTop = eleContainerLog.scrollHeight - eleContainerLog.clientHeight;
      }

      console['old' + name].apply(undefined, arguments);
    };
  }

  function produceOutput(name, args) {
    return args.reduce((output, arg) => {
      return output +
          '<span class="log-' + (typeof arg) + ' log-' + name + '">' +
          '[' + name.padStart(6, ' ').toUpperCase() + ']: ' + (typeof arg === 'object' && (JSON || {}).stringify ? JSON.stringify(arg) : arg) +
          '</span>&nbsp;';
    }, '');
  }
}