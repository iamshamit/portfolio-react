import { useState, useEffect, useContext, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { ThemeContext } from '../App';

const Terminal = () => {
  const { accentColor, setAccentColor, setIsTerminalOpen } = useContext(ThemeContext);
  const [term, setTerm] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPasswordPrompt, setIsPasswordPrompt] = useState(false);
  const [todos, setTodos] = useState([]);
  const terminalRef = useRef(null);
  const fitAddonRef = useRef(null);
  const inputRef = useRef(null);
  const [currentCommand, setCurrentCommand] = useState('');
  
  const SUDO_PASSWORD = import.meta.env.VITE_SUDO_PASSWORD;

  // Load todos from localStorage
  useEffect(() => {
    const storedTodos = localStorage.getItem('terminal-todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('terminal-todos', JSON.stringify(todos));
  }, [todos]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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
      fontSize: isMobile ? 12 : 14, // Smaller font for mobile
      theme: {
        background: '#070707',
        foreground: getThemeColor(accentColor),
        cursor: getThemeColor(accentColor),
        cursorAccent: '#000000',
        selection: 'rgba(255, 255, 255, 0.3)',
      },
      convertEol: true, // Important for proper line breaks
      rendererType: 'canvas', // Better performance
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
    let passwordInput = '';
    let history = [];
    let historyIndex = -1;

    // Initial prompt
    terminal.write('~/neo-portfolio $ ');

    // Handle key events only on desktop
    if (!isMobile) {
      terminal.onKey(({ key, domEvent }) => {
        // Password input mode
        if (isPasswordPrompt) {
          domEvent.preventDefault();
          
          if (domEvent.key === 'Enter') {
            terminal.write('\r\n');
            
            if (passwordInput === SUDO_PASSWORD) {
              setIsAdmin(true);
              terminal.write('Password correct. Admin privileges granted.\r\n');
            } else {
              terminal.write('Authentication failed: Incorrect password\r\n');
            }
            
            setIsPasswordPrompt(false);
            passwordInput = '';
            terminal.write('~/neo-portfolio $ ');
          } else if (domEvent.key === 'Escape') {
            setIsPasswordPrompt(false);
            passwordInput = '';
            terminal.write('\r\nOperation cancelled.\r\n');
            terminal.write('~/neo-portfolio $ ');
          } else if (domEvent.key === 'Backspace') {
            if (passwordInput.length > 0) {
              passwordInput = passwordInput.slice(0, -1);
              terminal.write('\b \b'); // Erase character from display
            }
          } else if (key.length === 1) {
            // For password, show * instead of the actual character
            passwordInput += key;
            terminal.write('*');
          }
          
          return;
        }
        
        // Normal input mode
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
          const allCommands = ['help', 'clear', 'exit', 'game', 'accent', 'sudo', 'addtodo', 'deltodo', 'edittodo', 'complete', 'listtodo', 'fact'];
          
          const matchingSuggestions = allCommands.filter((s) => s.startsWith(command));

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
    }

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
  }, [accentColor, isMobile, isPasswordPrompt, SUDO_PASSWORD, isAdmin]);

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

  // Handle mobile input submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (term && currentCommand.trim()) {
      if (isPasswordPrompt) {
        // Handle password submission from mobile
        if (currentCommand === SUDO_PASSWORD) {
          setIsAdmin(true);
          term.write('Password correct. Admin privileges granted.\r\n');
        } else {
          term.write('Authentication failed: Incorrect password\r\n');
        }
        setIsPasswordPrompt(false);
        term.write('~/neo-portfolio $ ');
      } else {
        term.write(currentCommand + '\r\n');
        processCommand(currentCommand.trim(), term);
      }
      setCurrentCommand('');
    }
  };

  // Enhanced Todo functions with sequential numbering
  const addTodo = (text) => {
    const newTodo = {
      id: Date.now().toString(),
      slno: todos.length + 1,
      text,
      completed: false,
      timestamp: new Date().toLocaleString()
    };
    setTodos([...todos, newTodo]);
    return newTodo;
  };

  const completeTodo = (slno) => {
    const index = todos.findIndex(todo => todo.slno === parseInt(slno));
    if (index === -1) return null;
    
    const updatedTodos = [...todos];
    updatedTodos[index] = {
      ...updatedTodos[index],
      completed: !updatedTodos[index].completed
    };
    
    setTodos(updatedTodos);
    return updatedTodos[index];
  };

  const deleteTodo = (slno) => {
    const index = todos.findIndex(todo => todo.slno === parseInt(slno));
    if (index === -1) return null;
    
    const deletedTodo = todos[index];
    const newTodos = todos.filter(todo => todo.slno !== parseInt(slno));
    
    // Update sequential numbers for all todos after the deleted one
    const reindexedTodos = newTodos.map((todo, idx) => ({
      ...todo,
      slno: idx + 1
    }));
    
    setTodos(reindexedTodos);
    return deletedTodo;
  };

  const editTodo = (slno, newText) => {
    const index = todos.findIndex(todo => todo.slno === parseInt(slno));
    if (index === -1) return null;
    
    const updatedTodos = [...todos];
    updatedTodos[index] = {
      ...updatedTodos[index],
      text: newText,
      timestamp: new Date().toLocaleString() + ' (edited)'
    };
    
    setTodos(updatedTodos);
    return updatedTodos[index];
  };

  // Fetch random fact from API
  const fetchRandomFact = async (terminal) => {
    terminal.write('Fetching a random fact...\r\n');
    
    try {
      const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
      const data = await response.json();
      
      terminal.write('\r\n' + '┌' + '─'.repeat(60) + '┐\r\n');
      terminal.write('│ ' + 'RANDOM FACT'.padEnd(58) + ' │\r\n');
      terminal.write('├' + '─'.repeat(60) + '┤\r\n');
      
      // Word wrap for the fact text to fit nicely in the box
      const words = data.text.split(' ');
      let line = '│ ';
      let lineLength = 2;
      
      for (const word of words) {
        if (lineLength + word.length + 1 > 59) {
          // Fill the rest of the line with spaces and add the right border
          terminal.write(line + ' '.repeat(59 - lineLength) + '│\r\n');
          line = '│ ' + word;
          lineLength = 2 + word.length;
        } else {
          if (line !== '│ ') {
            line += ' ';
            lineLength += 1;
          }
          line += word;
          lineLength += word.length;
        }
      }
      
      // Write the last line
      terminal.write(line + ' '.repeat(59 - lineLength) + '│\r\n');
      terminal.write('└' + '─'.repeat(60) + '┘\r\n\r\n');
      
      // Source attribution with slight styling
      terminal.write('Source: ' + data.source + '\r\n\r\n');
    } catch (error) {
      terminal.write('Error fetching random fact. Please try again.\r\n\r\n');
    }
    
    terminal.write('~/neo-portfolio $ ');
  };

  const processCommand = (cmd, terminal) => {
    const parts = cmd.split(' ');
    const baseCommand = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Check for sudo command
    if (baseCommand === 'sudo') {
      if (isAdmin) {
        terminal.write('You already have admin privileges.\r\n');
        terminal.write('~/neo-portfolio $ ');
        return;
      }
      
      terminal.write('Password: ');
      setIsPasswordPrompt(true);
      return;
    }

    // Handle todo commands
    switch (baseCommand) {
      case 'help':
        terminal.write('┌' + '─'.repeat(60) + '┐\r\n');
        terminal.write('│ ' + 'AVAILABLE COMMANDS'.padEnd(58) + ' │\r\n');
        terminal.write('├' + '─'.repeat(60) + '┤\r\n');
        terminal.write('│ ' + 'help'.padEnd(15) + '│ Show this help message'.padEnd(42) + ' │\r\n');
        terminal.write('│ ' + 'clear'.padEnd(15) + '│ Clear terminal'.padEnd(42) + ' │\r\n');
        terminal.write('│ ' + 'exit'.padEnd(15) + '│ Exit terminal mode'.padEnd(42) + ' │\r\n');
        terminal.write('│ ' + 'game'.padEnd(15) + '│ Play terminal game'.padEnd(42) + ' │\r\n');
        terminal.write('│ ' + 'accent [color]'.padEnd(15) + '│ Change theme color'.padEnd(42) + ' │\r\n');
        terminal.write('│ ' + 'fact'.padEnd(15) + '│ Show a random useless fact'.padEnd(42) + ' │\r\n');
        terminal.write('├' + '─'.repeat(60) + '┤\r\n');
        terminal.write('│ ' + 'TODO COMMANDS'.padEnd(58) + ' │\r\n');
        terminal.write('├' + '─'.repeat(60) + '┤\r\n');
        terminal.write('│ ' + 'addtodo <text>'.padEnd(15) + '│ Add a new todo item'.padEnd(42) + ' │\r\n');
        terminal.write('│ ' + 'listtodo'.padEnd(15) + '│ List all todo items'.padEnd(42) + ' │\r\n');
        terminal.write('│ ' + 'deltodo <slno>'.padEnd(15) + '│ Delete a todo item'.padEnd(42) + ' │\r\n');
        terminal.write('│ ' + 'edittodo <slno>'.padEnd(15) + '│ Edit a todo item'.padEnd(42) + ' │\r\n');
        terminal.write('│ ' + 'complete <slno>'.padEnd(15) + '│ Toggle completion status'.padEnd(42) + ' │\r\n');
        terminal.write('└' + '─'.repeat(60) + '┘\r\n');
        terminal.write('\r\n~/neo-portfolio $ ');
        break;

      case 'clear':
        terminal.clear();
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'exit':
        setIsAdmin(false); // Reset admin state on exit
        setIsTerminalOpen(false);
        break;

      case 'game':
        terminal.write('🎮 Launching pixel-art cyberpunk game...\r\n');
        terminal.write('▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒░░░░░░ 35%\r\n');
        setTimeout(() => {
          terminal.write('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒░░░ 65%\r\n');
          setTimeout(() => {
            terminal.write('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%\r\n\r\n');
            terminal.write('⚠️  Game functionality coming soon!\r\n');
            terminal.write('~/neo-portfolio $ ');
          }, 800);
        }, 600);
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
        
      case 'fact':
        fetchRandomFact(terminal);
        break;

      case 'addtodo':
        if (args.length === 0) {
          terminal.write('Usage: addtodo <text>\r\n');
          terminal.write('Example: addtodo Complete the React project\r\n');
        } else {
          const todoText = args.join(' ');
          const newTodo = addTodo(todoText);
          terminal.write(`Todo added: [${newTodo.slno}] ${todoText}\r\n`);
        }
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'listtodo':
        if (todos.length === 0) {
          terminal.write('No todos found. Use addtodo to create one.\r\n');
        } else {
          terminal.write('┌' + '─'.repeat(60) + '┐\r\n');
          terminal.write('│ ' + 'TODO LIST'.padEnd(58) + ' │\r\n');
          terminal.write('├' + '─'.repeat(6) + '┬' + '─'.repeat(10) + '┬' + '─'.repeat(42) + '┤\r\n');
          terminal.write('│ ' + 'ID'.padEnd(4) + ' │ ' + 'STATUS'.padEnd(8) + ' │ ' + 'TASK'.padEnd(40) + ' │\r\n');
          terminal.write('├' + '─'.repeat(6) + '┼' + '─'.repeat(10) + '┼' + '─'.repeat(42) + '┤\r\n');
          
          todos.forEach(todo => {
            const id = todo.slno.toString().padEnd(4);
            const status = todo.completed ? '✅ DONE' : '⏳ PEND';
            
            // Truncate task text if too long
            let task = todo.text;
            if (task.length > 39) {
              task = task.substring(0, 36) + '...';
            }
            
            terminal.write('│ ' + id + ' │ ' + status.padEnd(8) + ' │ ' + task.padEnd(40) + ' │\r\n');
          });
          
          terminal.write('└' + '─'.repeat(6) + '┴' + '─'.repeat(10) + '┴' + '─'.repeat(42) + '┘\r\n');
        }
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'complete':
        if (args.length === 0) {
          terminal.write('Usage: complete <ID>\r\n');
          terminal.write('Example: complete 1\r\n');
        } else {
          const slno = parseInt(args[0]);
          const updatedTodo = completeTodo(slno);
          
          if (updatedTodo) {
            const status = updatedTodo.completed ? '✅ DONE' : '⏳ PENDING';
            terminal.write(`Todo #${slno} marked as ${status}: ${updatedTodo.text}\r\n`);
          } else {
            terminal.write(`Error: No todo with ID ${slno} found\r\n`);
          }
        }
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'deltodo':
        if (args.length === 0) {
          terminal.write('Usage: deltodo <ID>\r\n');
          terminal.write('Example: deltodo 1\r\n');
        } else {
          const slno = parseInt(args[0]);
          const deletedTodo = deleteTodo(slno);
          
          if (deletedTodo) {
            terminal.write(`Todo #${slno} deleted: ${deletedTodo.text}\r\n`);
            terminal.write('Todo IDs have been reordered\r\n');
          } else {
            terminal.write(`Error: No todo with ID ${slno} found\r\n`);
          }
        }
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'edittodo':
        if (args.length < 2) {
          terminal.write('Usage: edittodo <ID> <new text>\r\n');
          terminal.write('Example: edittodo 1 Updated task description\r\n');
        } else {
          const slno = parseInt(args[0]);
          const newText = args.slice(1).join(' ');
          const editedTodo = editTodo(slno, newText);
          
          if (editedTodo) {
            terminal.write(`Todo #${slno} updated: ${editedTodo.text}\r\n`);
          } else {
            terminal.write(`Error: No todo with ID ${slno} found\r\n`);
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

  // Get available commands based on admin status
  const getAvailableCommands = () => {
    return ['help', 'clear', 'exit', 'game', 'accent', 'sudo', 'addtodo', 'deltodo', 'edittodo', 'complete', 'listtodo', 'fact'];
  };

  return (
    <div className="fixed inset-0 bg-[#070707] z-50 animate-slide-in p-4 flex flex-col">
      <div className="absolute top-2 right-2 p-2 rounded bg-gray-800 text-xs">
        Type <span className="text-cyan-400 font-bold">help</span> for commands
      </div>
      <div ref={terminalRef} id="terminal" className="w-full flex-grow overflow-hidden rounded-md" />
      
      {/* Mobile input interface */}
      {isMobile && (
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="flex">
            <span className={`hidden md:inline-block text-${getThemeColor(accentColor)} mr-2`}>
              {isPasswordPrompt ? 'Password: ' : '~/neo-portfolio' }
            </span>
            <input
              ref={inputRef}
              type={isPasswordPrompt ? "password" : "text"}
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              className="flex-grow bg-black/50 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
              placeholder={isPasswordPrompt ? "Enter password..." : "Type command here..."}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <button 
              type="submit" 
              className={`ml-2 px-4 py-2 border border-${getThemeColor(accentColor)} rounded text-${getThemeColor(accentColor)}`}
            >
              Send
            </button>
          </form>
          
          {/* Quick access buttons for common commands */}
          <div className="mt-3 flex flex-wrap gap-2">
            {getAvailableCommands().map(cmd => (
              <button
                key={cmd}
                onClick={() => {
                  setCurrentCommand(cmd);
                  if (inputRef.current) inputRef.current.focus();
                }}
                className={`px-3 py-1 text-sm border border-gray-700 rounded hover:border-${getThemeColor(accentColor)} hover:text-${getThemeColor(accentColor)} transition-colors`}
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Admin indicator */}
      {isAdmin && (
        <div className={`absolute top-2 left-2 px-3 py-1.5 text-sm rounded-full bg-${getThemeColor(accentColor)} bg-opacity-20 border border-${getThemeColor(accentColor)} text-${getThemeColor(accentColor)}`}>
          Admin
        </div>
      )}
    </div>
  );
};

export default Terminal;