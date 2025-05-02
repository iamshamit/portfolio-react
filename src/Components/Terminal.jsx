import React, { useState, useEffect, useContext, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { ThemeContext } from '../App';

const Terminal = () => {
  const { accentColor, setAccentColor, setIsTerminalOpen } = useContext(ThemeContext);
  const [term, setTerm] = useState(null);
  const terminalRef = useRef(null);
  const fitAddonRef = useRef(null);

  // Function to get theme color based on accentColor
  const getThemeColor = (color) => {
    switch (color) {
      case 'neon-blue':
        return '#00F3FF';
      case 'neon-green':
        return '#00FF88';
      case 'neon-purple':
        return '#B388FF';
      default:
        return '#00F3FF';
    }
  };

  useEffect(() => {
    // Ensure terminal container exists
    const termElement = document.getElementById('terminal');
    if (!termElement) return;

    // Create terminal instance
    const terminal = new XTerm({
      cursorBlink: true,
      fontFamily: 'Space Mono, monospace',
      fontSize: 14,
      theme: {
        background: '#070707',
        foreground: getThemeColor(accentColor),
        cursor: getThemeColor(accentColor),
        cursorAccent: '#000000',
        selection: 'rgba(255, 255, 255, 0.3)',
      },
    });

    // Create and load fit addon
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    fitAddonRef.current = fitAddon;

    // Open terminal and fit to container
    terminal.open(termElement);
    fitAddon.fit();

    setTerm(terminal);

    // Terminal state
    let command = '';
    let history = [];
    let historyIndex = -1;

    // Initial prompt
    terminal.write('~/neo-portfolio $ ');

    // Handle key events
    terminal.onKey(({ key, domEvent }) => {
      if (domEvent.key === 'Enter') {
        terminal.write('\r\n');
        const cmd = command.trim();
        if (cmd) {
          history.push(cmd);
          historyIndex = history.length;
          processCommand(cmd, terminal);
        } else {
          terminal.write('~/neo-portfolio $ ');
        }
        command = '';
      } else if (domEvent.key === 'Backspace') {
        if (command.length > 0) {
          command = command.slice(0, -1);
          terminal.write('\b \b');
        }
      } else if (domEvent.key === 'ArrowUp') {
        if (history.length > 0 && historyIndex > 0) {
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
        const matchingSuggestions = suggestions.filter((s) => s.startsWith(command));

        if (matchingSuggestions.length === 1) {
          command = matchingSuggestions[0];
          terminal.write('\r\x1B[K~/neo-portfolio $ ' + command);
        } else if (matchingSuggestions.length > 1) {
          terminal.write('\r\n');
          terminal.write(matchingSuggestions.join('  ') + '\r\n');
          terminal.write('~/neo-portfolio $ ' + command);
        }
      } else if (key.charCodeAt(0) >= 32 && key.charCodeAt(0) <= 126) {
        command += key;
        terminal.write(key);
      }
    });

    // Handle container resize with ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (fitAddonRef.current) {
        try {
          fitAddonRef.current.fit();
        } catch (err) {
          console.error('Fit addon error:', err);
        }
      }
    });
    resizeObserver.observe(termElement);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      if (terminal) {
        terminal.dispose();
      }
      setTerm(null);
      fitAddonRef.current = null;
    };
  }, [accentColor]);

  // Update terminal theme when accent color changes
  useEffect(() => {
    if (term) {
      term.options.theme = {
        ...term.options.theme,
        foreground: getThemeColor(accentColor),
        cursor: getThemeColor(accentColor),
      };
      // Refresh the entire terminal
      term.refresh(0, term.rows - 1);
    }
  }, [accentColor, term]);

  const processCommand = (cmd, terminal) => {
    const parts = cmd.split(' ');
    const baseCommand = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (baseCommand) {
      case 'help':
        terminal.write('Available commands:\r\n');
        terminal.write('  help                Show this help message\r\n');
        terminal.write('  about               About me\r\n');
        terminal.write('  skills              My technical skills\r\n');
        terminal.write('  projects            View my projects\r\n');
        terminal.write('  contact             Contact information\r\n');
        terminal.write('  clear               Clear terminal\r\n');
        terminal.write('  exit                Exit terminal mode\r\n');
        terminal.write('  matrix              Run Matrix effect\r\n');
        terminal.write('  hack                Hack the mainframe\r\n');
        terminal.write('  game                Play terminal game\r\n');
        terminal.writeln('  accent [color]      Change theme color (neon-blue, neon-green, neon-purple)\r\n');
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'about':
        terminal.write('Shamit Mishra - Full-Stack Developer\r\n');
        terminal.write('----------------------------\r\n');
        terminal.write('I build scalable web applications with modern technologies.\r\n');
        terminal.write('Passionate about cyberpunk aesthetics and clean, efficient code.\r\n');
        terminal.writeln('Based in Neo-Tokyo, available for freelance and full-time positions.\r\n');
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'skills':
        terminal.write('Technical Skills:\r\n');
        terminal.write('----------------\r\n');
        terminal.write('Frontend: React, Vue, Tailwind CSS, JavaScript/TypeScript\r\n');
        terminal.write('Backend: Node.js, Python, GraphQL, RESTful APIs\r\n');
        terminal.write('DevOps: Docker, AWS, CI/CD, Git\r\n');
        terminal.writeln('Other: UI/UX Design, Agile Methodologies\r\n');
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'projects':
        terminal.write('Featured Projects:\r\n');
        terminal.write('-----------------\r\n');
        terminal.write('CyberShop: E-commerce platform with AR product visualization\r\n');
        terminal.write('NeoChat: End-to-end encrypted messaging application\r\n');
        terminal.write('DataViz: Interactive data visualization dashboard\r\n');
        terminal.writeln('Type "project [name]" for more details\r\n');
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'contact':
        terminal.write('Contact Information:\r\n');
        terminal.write('-------------------\r\n');
        terminal.write('Email: john@doe.com\r\n');
        terminal.write('GitHub: github.com/johndoe\r\n');
        terminal.write('LinkedIn: linkedin.com/in/johndoe\r\n');
        terminal.writeln('Twitter: @johndoedev\r\n');
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'clear':
        terminal.clear();
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'exit':
        setIsTerminalOpen(false);
        break;

      case 'matrix':
        terminal.write('Initiating Matrix code rain simulation...\r\n');
        runMatrixEffect(terminal);
        break;

      case 'hack':
        terminal.write('ACCESSING MAINFRAME...\r\n');
        setTimeout(() => {
          terminal.write('BYPASSING SECURITY...\r\n');
          setTimeout(() => {
            terminal.write('ACCESS GRANTED: Welcome to the mainframe!\r\n');
            terminal.write('~/neo-portfolio $ ');
          }, 1000);
        }, 800);
        break;

      case 'game':
        terminal.write('Launching pixel-art cyberpunk game...\r\n');
        terminal.writeln('Game functionality coming soon!\r\n');
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'accent':
        if (args.length === 0) {
          terminal.write(`Current accent color: ${accentColor}\r\n`);
          terminal.write('Available colors: neon-blue, neon-green, neon-purple\r\n');
          terminal.write('Usage: accent [color]\r\n');
        } else {
          const newColor = args[0];
          if (['neon-blue', 'neon-green', 'neon-purple'].includes(newColor)) {
            setAccentColor(newColor);
            terminal.write(`Accent color changed to ${newColor}\r\n`);
          } else {
            terminal.write(`Invalid color: ${newColor}\r\n`);
            terminal.write('Available colors: neon-blue, neon-green, neon-purple\r\n');
          }
        }
        terminal.write('~/neo-portfolio $ ');
        break;

      default:
        terminal.write(`Command not found: ${cmd}\r\n`);
        terminal.write('Type "help" for available commands\r\n');
        terminal.write('~/neo-portfolio $ ');
    }
  };

  // Simple Matrix rain effect
  const runMatrixEffect = (terminal) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789αβγδεζηθικλμνξοπρστυφχψω';
    const columns = Math.floor(terminal.cols / 2);
    const drops = Array(columns).fill(0);

    let interval = setInterval(() => {
      let output = '';
      for (let i = 0; i < drops.length; i++) {
        const charIndex = Math.floor(Math.random() * chars.length);
        output += '\x1b[32m' + chars[charIndex] + ' ';

        drops[i]++;
        if (drops[i] > terminal.rows * 0.6 && Math.random() > 0.95) {
          drops[i] = 0;
        }
      }
      terminal.write('\r\n' + output);

      // Stop after 15 iterations
      if (drops.filter((d) => d > 15).length > columns * 0.8) {
        clearInterval(interval);
        terminal.writeln('\x1b[0m\r\n\r\nMatrix simulation complete.\r\n');
        terminal.write('~/neo-portfolio $ ');
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 bg-[#070707] z-50 animate-slide-in p-4">
      <div ref={terminalRef} id="terminal" className="w-full h-full overflow-hidden rounded-md" />
    </div>
  );
};

export default Terminal;