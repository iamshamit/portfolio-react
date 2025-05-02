import React, { useState, useEffect, useContext } from 'react';
import { Terminal as XTerm } from 'xterm';
import 'xterm/css/xterm.css';
import { ThemeContext } from '../App';

const Terminal = () => {
  const { accentColor, setIsTerminalOpen } = useContext(ThemeContext);
  const [term, setTerm] = useState(null);

  useEffect(() => {
    const terminal = new XTerm({
      cursorBlink: true,
      fontFamily: 'Fira Code, monospace',
      theme: {
        background: '#0D0D0D',
        foreground: accentColor === 'neon-blue' ? '#00FFF7' : accentColor === 'neon-green' ? '#00FF88' : '#B388FF',
      },
    });

    const termElement = document.getElementById('terminal');
    terminal.open(termElement);
    setTerm(terminal);

    let command = '';
    let history = [];
    let historyIndex = -1;

    terminal.write('~/neo-portfolio $ ');

    terminal.onKey(({ key, domEvent }) => {
      if (domEvent.key === 'Enter') {
        terminal.write('\r\n');
        const cmd = command.trim();
        history.push(cmd);
        historyIndex = history.length;
        processCommand(cmd, terminal);
        command = '';
        terminal.write('~/neo-portfolio $ ');
      } else if (domEvent.key === 'Backspace') {
        if (command.length > 0) {
          command = command.slice(0, -1);
          terminal.write('\b \b');
        }
      } else if (domEvent.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          terminal.write('\r\x1B[K~/neo-portfolio $ ' + history[historyIndex]);
          command = history[historyIndex];
        }
      } else if (domEvent.key === 'ArrowDown') {
        if (historyIndex < history.length - 1) {
          historyIndex++;
          terminal.write('\r\x1B[K~/neo-portfolio $ ' + history[historyIndex]);
          command = history[historyIndex];
        } else {
          historyIndex = history.length;
          terminal.write('\r\x1B[K~/neo-portfolio $ ');
          command = '';
        }
      } else if (domEvent.key === 'Tab') {
        domEvent.preventDefault();
        const suggestions = ['help', 'about', 'skills', 'projects', 'contact', 'clear', 'exit', 'matrix', 'hack', 'game', 'accent'];
        const match = suggestions.find((s) => s.startsWith(command));
        if (match) {
          command = match;
          terminal.write('\r\x1B[K~/neo-portfolio $ ' + command);
        }
      } else if (key >= ' ' && key <= '~') {
        command += key;
        terminal.write(key);
      }
    });

    return () => terminal.dispose();
  }, [accentColor]);

  const processCommand = (cmd, terminal) => {
    switch (cmd) {
      case 'help':
        terminal.write('Available commands: help, about, skills, projects, contact, clear, exit, matrix, hack, game, accent neon-blue|neon-green|neon-purple\r\n');
        break;
      case 'about':
        terminal.write('John Doe - Full-Stack Developer passionate about cyberpunk aesthetics and scalable apps.\r\n');
        break;
      case 'skills':
        terminal.write('React, Node.js, Tailwind CSS, JavaScript, Python, Docker\r\n');
        break;
      case 'projects':
        terminal.write('CyberShop: E-commerce platform\nNeoChat: Encrypted messaging app\r\n');
        break;
      case 'contact':
        terminal.write('Email: john@doe.com\nGitHub: github.com/johndoe\nLinkedIn: linkedin.com/in/johndoe\r\n');
        break;
      case 'clear':
        terminal.clear();
        break;
      case 'exit':
        setIsTerminalOpen(false);
        break;
      case 'matrix':
        terminal.write('Initiating Matrix code rain...\r\n');
        // Placeholder for Matrix effect
        break;
      case 'hack':
        terminal.write('Access Granted: Welcome to the mainframe!\r\n');
        // Placeholder for screen distortion
        break;
      case 'game':
        terminal.write('Launching pixel-art cyberpunk game...\r\n');
        // Placeholder for game
        break;
      case 'accent neon-blue':
      case 'accent neon-green':
      case 'accent neon-purple':
        const color = cmd.split(' ')[1];
        setIsTerminalOpen(false);
        setTimeout(() => setIsTerminalOpen(true), 0);
        break;
      default:
        terminal.write(`Command not found: ${cmd}\r\n`);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0D0D0D] z-50 animate-slide-in">
      <div id="terminal" className="w-full h-full" />
    </div>
  );
};

export default Terminal;