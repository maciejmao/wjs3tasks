const terminal = (function () {
  const DEFAULT_PREFIX = 'terminal: ';
  const DEFAULT_COMMANDS = {
    clear: {
      msg: clearTerminal,
    },
    help: {
      msg: listAllCommands,
    },
    quote: {
      msg: getQoute,
    },
    double: {
      msg: multiplyBy2,
      args: true,
    },
  };
  const config = {};

  function initTerminal(userCommands, outputField) {
    if (!setConfig(userCommands, outputField)) throw new Error('no output for terminal');
    localStorage.setItem('logindate', Date.now());
    startMessage();
  }

  function setConfig(userCommands = {}, outputField = null) {
    if (!outputField) return false;
    config.loginDate = Number(localStorage.getItem('logindate')) || Date.now();
    config.commands = Object.assign({}, DEFAULT_COMMANDS, userCommands);
    config.inputHistory = { list: [], pointer: -1 };
    config.output = outputField;
    return true;
  }

  function startMessage() {
    const startDate = new Date(config.loginDate).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      weekday: 'short',
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      second: '2-digit',
    });
    prepareContent(startDate + ' GMT', 'Last login: ');
  }

  function clearTerminal() {
    config.output.textContent = '';
    startMessage();
  }

  function listAllCommands() {
    const list = getAllCommands();
    const m = 'List of all commands:';
    const els = [];

    for (const item of list) {
      const el = document.createElement('span');
      const args = config.commands[item].args ? ' [args]' : '';
      el.textContent = item + args;
      els.push(el);
    }
    prepareContent(m, '', els);
  }

  function getQoute() {
    const quoteURL = 'https://dummyjson.com/quotes/random';
    fetch(quoteURL)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then((data) => prepareContent(data.quote))
      .catch((error) => showError(error));
  }

  function multiplyBy2(args) {
    const num = args[0];
    if (num && !isNaN(num)) prepareContent(num * 2);
    else showError('This command needs more paramaters in correct format (number)');
  }

  function executeCommand(input) {
    config.inputHistory.list.unshift(input);
    config.inputHistory.pointer = -1;
    const command = input.split(' ');
    const c = command[0];
    const args = command.slice(1);
    prepareContent(c, 'you: ');
    const result = getAllCommands().filter((key) => key === c);
    if (result.length) {
      if (typeof config.commands[c].msg === 'function') config.commands[c].msg(args);
      else prepareContent(config.commands[c].msg);
    } else {
      const m = "Command not found, check 'help' to see full list of commands";
      showError(m);
    }
  }

  function showError(m) {
    prepareContent(m, 'error: ');
  }

  function prepareContent(message, prefix = '', extraContent = '') {
    const els = [];
    const elT = document.createElement('p');
    const elPrefix = prefix || DEFAULT_PREFIX;
    elT.textContent = elPrefix + message;
    els.push(elT);

    if (extraContent) {
      const elE = document.createElement('p');
      for (const el of extraContent) {
        elE.append(el);
      }
      els.push(elE);
    }

    addToOutput(...els);
  }

  function addToOutput(...content) {
    for (const element of content) {
      config.output.append(element);
    }

    if (config.output.scrollTop < config.output.scrollHeight - config.output.clientHeight) {
      content[content.length - 1].scrollIntoView();
    }
  }

  function getFromHistory(change) {
    let newPointer = config.inputHistory.pointer;
    newPointer = newPointer + change;

    if (config.inputHistory.list.length && newPointer < config.inputHistory.list.length && newPointer > -1) {
      config.inputHistory.pointer = newPointer;
      return config.inputHistory.list[newPointer];
    }
    return false;
  }

  function getHints(w) {
    const result = getAllCommands()
      .filter((key) => key.includes(w))
      .map((item) => {
        const args = config.commands[item].args ? ' [args]' : '';
        return item + args;
      });
    if (result.length) return result;
    return false;
  }

  function getAllCommands() {
    return Object.keys(config.commands);
  }

  return {
    init: initTerminal,
    execute: executeCommand,
    history: getFromHistory,
    hints: getHints,
  };
})();

const CUSTOM_COMMANDS = {
  hello: {
    msg: 'Hello :)',
  },
};

const input = document.body.querySelector('#terminal');
const output = document.body.querySelector('#terminal_output');
const hints = document.body.querySelector('#terminal_hints .suggestions');
input.addEventListener('keydown', setCommand);
input.addEventListener('input', setHints);
terminal.init(CUSTOM_COMMANDS, output);
input.focus();

function setCommand(e) {
  switch (e.keyCode) {
    case 13:
      const phrase = e.target.value.trim().toLowerCase();
      if (phrase) terminal.execute(phrase);
      e.target.value = '';
      hints.parentNode.classList.add('hidden');
      break;
    case 38:
      const changeUp = terminal.history(1);
      if (changeUp) e.target.value = changeUp;
      e.preventDefault();
      break;
    case 40:
      const changeDown = terminal.history(-1);
      if (changeDown) e.target.value = changeDown;
      e.preventDefault();
      break;
  }
}

function setHints(e) {
  const word = e.target.value.trim().toLowerCase();
  if (word && word.length > 1) {
    const match = terminal.hints(word);
    if (match.length) {
      hints.textContent = match.join(',');
      hints.parentNode.classList.remove('hidden');
    }
  } else {
    hints.parentNode.classList.add('hidden');
  }
}
