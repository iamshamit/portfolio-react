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
              terminal.write('New commands available: system, decrypt, network, override\r\n');
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
          const allCommands = ['help', 'about', 'skills', 'projects', 'contact', 'clear', 'exit', 'matrix', 'hack', 'game', 'accent', 'sudo', 'todo', 'addTodo', 'listTodo', 'completeTodo', 'deleteTodo'];
          
          // Add admin commands if user is authenticated
          if (isAdmin) {
            allCommands.push('system', 'decrypt', 'network', 'override', 'todoAdmin');
          }
          
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
          term.write('New commands available: system, decrypt, network, override\r\n');
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

  // Todo functions
  const addTodo = (text) => {
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      timestamp: new Date().toLocaleString()
    };
    setTodos([...todos, newTodo]);
    return newTodo;
  };

  const completeTodo = (id) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    return updatedTodos.find(todo => todo.id === id);
  };

  const deleteTodo = (id) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    setTodos(todos.filter(todo => todo.id !== id));
    return todoToDelete;
  };

  // Handle ToDo Commands
  const handleTodoCommand = (command, args, terminal) => {
    switch (command) {
      case 'todo':
      case 'help':
        terminal.write('Todo Commands:\r\n');
        terminal.write('  addTodo <task>       Add a new todo\r\n');
        terminal.write('  listTodo             List all todos\r\n');
        terminal.write('  completeTodo <id>    Toggle completion status\r\n');
        terminal.write('  deleteTodo <id>      Remove a todo\r\n');
        if (isAdmin) {
          terminal.write('  todoAdmin            Advanced todo management (admin only)\r\n');
        }
        terminal.write('\r\n~/neo-portfolio $ ');
        break;

      case 'add':
        if (args.length === 0) {
          terminal.write('Usage: addTodo <task>\r\n');
          terminal.write('Example: addTodo Fix login page\r\n');
        } else {
          const todoText = args.join(' ');
          const newTodo = addTodo(todoText);
          terminal.write(`Todo added: [${newTodo.id}] ${todoText}\r\n`);
        }
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'list':
        if (todos.length === 0) {
          terminal.write('No todos found. Use addTodo to create one.\r\n');
        } else {
          terminal.write('ID    | Status    | Task\r\n');
          terminal.write('----------------------------\r\n');
          todos.forEach(todo => {
            const status = todo.completed ? 'DONE' : 'PENDING';
            terminal.write(`${todo.id.slice(-4)} | ${status.padEnd(9)} | ${todo.text}\r\n`);
          });
        }
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'complete':
        if (args.length === 0) {
          terminal.write('Usage: completeTodo <id>\r\n');
          terminal.write('Example: completeTodo 1234\r\n');
        } else {
          const id = args[0];
          const matchingTodos = todos.filter(todo => todo.id.endsWith(id));
          
          if (matchingTodos.length === 0) {
            terminal.write(`Error: No todo with ID ending in ${id} found\r\n`);
          } else if (matchingTodos.length > 1) {
            terminal.write(`Error: Multiple todos match ID ${id}. Please use a more specific ID.\r\n`);
            terminal.write('Matching todos:\r\n');
            matchingTodos.forEach(todo => {
              terminal.write(`${todo.id}: ${todo.text}\r\n`);
            });
          } else {
            const updatedTodo = completeTodo(matchingTodos[0].id);
            terminal.write(`Todo status updated: [${updatedTodo.id.slice(-4)}] ${updatedTodo.text} - ${updatedTodo.completed ? 'DONE' : 'PENDING'}\r\n`);
          }
        }
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'delete':
        if (args.length === 0) {
          terminal.write('Usage: deleteTodo <id>\r\n');
          terminal.write('Example: deleteTodo 1234\r\n');
        } else {
          const id = args[0];
          const matchingTodos = todos.filter(todo => todo.id.endsWith(id));
          
          if (matchingTodos.length === 0) {
            terminal.write(`Error: No todo with ID ending in ${id} found\r\n`);
          } else if (matchingTodos.length > 1) {
            terminal.write(`Error: Multiple todos match ID ${id}. Please use a more specific ID.\r\n`);
            terminal.write('Matching todos:\r\n');
            matchingTodos.forEach(todo => {
              terminal.write(`${todo.id}: ${todo.text}\r\n`);
            });
          } else {
            const deletedTodo = deleteTodo(matchingTodos[0].id);
            terminal.write(`Todo deleted: [${deletedTodo.id.slice(-4)}] ${deletedTodo.text}\r\n`);
          }
        }
        terminal.write('~/neo-portfolio $ ');
        break;

      case 'admin':
        if (!isAdmin) {
          terminal.write('Permission denied: todoAdmin requires admin privileges\r\n');
          terminal.write('Try using sudo to elevate privileges\r\n');
        } else {
          terminal.write('Todo Admin Panel:\r\n');
          terminal.write('----------------\r\n');
          terminal.write(`Total todos: ${todos.length}\r\n`);
          terminal.write(`Completed: ${todos.filter(t => t.completed).length}\r\n`);
          terminal.write(`Pending: ${todos.filter(t => !t.completed).length}\r\n\r\n`);
          
          terminal.write('Admin Commands:\r\n');
          terminal.write('  todoAdmin clear       Clear all todos\r\n');
          terminal.write('  todoAdmin export      Export todos as JSON\r\n');
          terminal.write('  todoAdmin stats       Show detailed statistics\r\n\r\n');
          
          if (args.length > 0) {
            switch(args[0]) {
              case 'clear':
                terminal.write('WARNING: This will delete ALL todos\r\n');
                terminal.write('Type "CONFIRM" to proceed: ');
                // In a real implementation, you'd wait for input here
                // For demo purposes, we'll simulate auto-confirmation
                setTimeout(() => {
                  terminal.write('CONFIRM\r\n');
                  setTodos([]);
                  terminal.write('All todos cleared successfully\r\n');
                  terminal.write('~/neo-portfolio $ ');
                }, 1500);
                return; // Skip the prompt at the end
                
              case 'export':
                const exportData = JSON.stringify(todos, null, 2);
                terminal.write('Exporting todos...\r\n');
                terminal.write('-------------------\r\n');
                terminal.write(exportData + '\r\n');
                terminal.write('-------------------\r\n');
                terminal.write('Copy the above JSON data or save to a file\r\n');
                break;
                
              case 'stats':
                terminal.write('Todo Statistics:\r\n');
                terminal.write('---------------\r\n');
                terminal.write(`Total todos created: ${todos.length}\r\n`);
                terminal.write(`Completion rate: ${Math.round((todos.filter(t => t.completed).length / (todos.length || 1)) * 100)}%\r\n`);
                
                if (todos.length > 0) {
                  const oldestTodo = todos.reduce((oldest, todo) => 
                    new Date(todo.timestamp) < new Date(oldest.timestamp) ? todo : oldest, todos[0]);
                  
                  const newestTodo = todos.reduce((newest, todo) => 
                    new Date(todo.timestamp) > new Date(newest.timestamp) ? todo : newest, todos[0]);
                  
                  terminal.write(`Oldest todo: ${oldestTodo.text} (${oldestTodo.timestamp})\r\n`);
                  terminal.write(`Newest todo: ${newestTodo.text} (${newestTodo.timestamp})\r\n`);
                }
                break;
            }
          }
        }
        terminal.write('~/neo-portfolio $ ');
        break;

      default:
        terminal.write(`Unknown todo command: ${command}\r\n`);
        terminal.write('Type "todo help" for available commands\r\n');
        terminal.write('~/neo-portfolio $ ');
    }
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
    
    // Admin-only commands
    if (['system', 'decrypt', 'network', 'override', 'todoadmin'].includes(baseCommand) && !isAdmin) {
      terminal.write(`Permission denied: '${baseCommand}' requires admin privileges\r\n`);
      terminal.write('Try using sudo to elevate privileges\r\n');
      terminal.write('~/neo-portfolio $ ');
      return;
    }

    // Todo commands
    if (baseCommand === 'todo') {
      if (args.length === 0) {
        handleTodoCommand('help', [], terminal);
      } else {
        handleTodoCommand(args[0], args.slice(1), terminal);
      }
      return;
    } else if (baseCommand === 'addtodo') {
      handleTodoCommand('add', args, terminal);
      return;
    } else if (baseCommand === 'listtodo') {
      handleTodoCommand('list', [], terminal);
      return;
    } else if (baseCommand === 'completetodo') {
      handleTodoCommand('complete', args, terminal);
      return;
    } else if (baseCommand === 'deletetodo') {
      handleTodoCommand('delete', args, terminal);
      return;
    } else if (baseCommand === 'todoadmin') {
      handleTodoCommand('admin', args, terminal);
      return;
    }

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
        terminal.write('  accent [color]      Change theme color (neon-blue, neon-green, neon-purple)\r\n');
        terminal.write('  sudo                Elevate to admin privileges\r\n');
        terminal.write('\r\nTodo commands:\r\n');
        terminal.write('  todo                Todo help menu\r\n');
        terminal.write('  addTodo <task>      Add a new todo\r\n');
        terminal.write('  listTodo            List all todos\r\n');
        terminal.write('  completeTodo <id>   Toggle completion status\r\n');
        terminal.write('  deleteTodo <id>     Remove a todo\r\n');
        
        if (isAdmin) {
          terminal.write('\r\nAdmin commands:\r\n');
          terminal.write('  system             Display system information\r\n');
          terminal.write('  decrypt [file]     Decrypt secure files\r\n');
          terminal.write('  network            Network diagnostic tools\r\n');
          terminal.write('  override           Override security protocols\r\n');
          terminal.write('  todoAdmin          Advanced todo management\r\n');
        }
        
        terminal.write('\r\n~/neo-portfolio $ ');
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
        setIsAdmin(false); // Reset admin state on exit
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

      // Admin commands
      case 'system':
        showSystemInfo(terminal);
        break;
        
      case 'decrypt':
        if (args.length === 0) {
          terminal.write('Usage: decrypt [filename]\r\n');
          terminal.write('Available files: user_data.enc, project_titan.enc, network_logs.enc\r\n');
        } else {
          decryptFile(args[0], terminal);
        }
        terminal.write('~/neo-portfolio $ ');
        break;
        
      case 'network':
        showNetworkDiagnostics(terminal);
        break;
        
      case 'override':
        runSecurityOverride(terminal);
        break;

      default:
        terminal.write(`Command not found: ${cmd}\r\n`);
        terminal.write('Type "help" for available commands\r\n');
        terminal.write('~/neo-portfolio $ ');
    }
  };

  // Admin command functions
  const showSystemInfo = (terminal) => {
    terminal.write('System Information:\r\n');
    terminal.write('------------------\r\n');
    terminal.write('OS: NeoOS v4.5.2 (Cyberpunk Edition)\r\n');
    terminal.write('Kernel: 5.15.0-neomind\r\n');
    terminal.write('Uptime: 427 days, 13 hours, 22 minutes\r\n');
    terminal.write('Memory: 64.2 TB Quantum Memory\r\n');
    terminal.write('CPU: NeoTech Hypercore (128 cores)\r\n');
    terminal.write('GPU: RayTracer X9000 Ultimate\r\n');
    terminal.write('Network: NeuroLink Quantum (9.8 PB/s)\r\n\r\n');
    terminal.write('~/neo-portfolio $ ');
  };
  
  const decryptFile = (filename, terminal) => {
    const files = {
      'user_data.enc': [
        'DECRYPTING user_data.enc...',
        'File contains user profiles and access credentials.',
        'WARNING: This file contains sensitive information.',
        '----------------------',
        'Admin users:',
        '- neomancer (last login: 2077-05-02)',
        '- shadowrunner (last login: 2077-05-01)',
        '- cyberphantom (last login: 2077-04-29)',
        '----------------------'
      ],
      'project_titan.enc': [
        'DECRYPTING project_titan.enc...',
        'Project Titan: Classified Research Initiative',
        'Status: In Development (Phase 3)',
        'Lead: Dr. Akira Nakamura',
        'Objective: Neural interface for direct brain-computer connection',
        'Current Challenge: Signal degradation after 36 hours of continuous use',
        'Next Milestone: Human trials scheduled for Q3 2077'
      ],
      'network_logs.enc': [
        'DECRYPTING network_logs.enc...',
        'Network logs for period: April 15-30, 2077',
        'Detected 347 intrusion attempts (all blocked)',
        'Origin IPs: 187.43.221.98, 103.57.192.44, 42.199.87.163',
        'Advanced persistent threat detected from group "RedPhantom"',
        'Recommended action: Update firewall signatures'
      ]
    };
    
    if (files[filename]) {
      for (let i = 0; i < files[filename].length; i++) {
        terminal.write(files[filename][i] + '\r\n');
      }
    } else {
      terminal.write(`Error: File "${filename}" not found or cannot be decrypted.\r\n`);
      terminal.write('Available files: user_data.enc, project_titan.enc, network_logs.enc\r\n');
    }
  };
  
  const showNetworkDiagnostics = (terminal) => {
    terminal.write('RUNNING NETWORK DIAGNOSTICS\r\n');
    terminal.write('-------------------------\r\n');
    setTimeout(() => {
      terminal.write('Checking connection to local nodes...\r\n');
      setTimeout(() => {
        terminal.write('Local nodes: OK (5ms latency)\r\n');
        terminal.write('Checking connection to global network...\r\n');
        setTimeout(() => {
          terminal.write('Global network: OK (23ms latency)\r\n');
          terminal.write('Checking for intrusions...\r\n');
          setTimeout(() => {
            terminal.write('No active intrusions detected\r\n');
            terminal.write('Running port scan...\r\n');
            setTimeout(() => {
              terminal.write('Ports 22, 80, 443 open\r\n');
              terminal.write('All other ports secured\r\n');
              terminal.write('Network status: SECURE\r\n\r\n');
              terminal.write('~/neo-portfolio $ ');
            }, 500);
          }, 600);
        }, 400);
      }, 300);
    }, 200);
  };
  
  const runSecurityOverride = (terminal) => {
    terminal.write('INITIATING SECURITY OVERRIDE\r\n');
    terminal.write('---------------------------\r\n');
    terminal.write('WARNING: This action will temporarily disable security protocols\r\n');
    terminal.write('Continue? (y/n): ');
    
    // Instead of waiting for input, we'll auto-proceed for this demo
    setTimeout(() => {
      terminal.write('y\r\n');
      terminal.write('Disabling intrusion countermeasures...\r\n');
      setTimeout(() => {
        terminal.write('Bypassing authentication requirements...\r\n');
        setTimeout(() => {
          terminal.write('Unlocking restricted systems...\r\n');
          setTimeout(() => {
            terminal.write('\r\n[ACCESS GRANTED]\r\n');
            terminal.write('All security systems temporarily disabled for admin access\r\n');
            terminal.write('\r\nSecurity will automatically re-engage in 10 minutes\r\n');
            terminal.write('Use extreme caution during this window\r\n\r\n');
            terminal.write('~/neo-portfolio $ ');
          }, 800);
        }, 700);
      }, 600);
    }, 1500);
  };

  // Simple Matrix rain effect
  const runMatrixEffect = (terminal) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789αβγδεζηθικλμνξοπρστυφχψω';
    const columns = Math.floor(terminal.cols / 2);
    const rows = Math.min(terminal.rows, isMobile ? 10 : 20); // Limit rows on mobile
    const drops = Array(columns).fill(0);

    let interval = setInterval(() => {
      let output = '';
      for (let i = 0; i < drops.length; i++) {
        const charIndex = Math.floor(Math.random() * chars.length);
        output += '\x1b[32m' + chars[charIndex] + ' ';

        drops[i]++;
        if (drops[i] > rows * 0.6 && Math.random() > 0.95) {
          drops[i] = 0;
        }
      }
      terminal.write('\r\n' + output);

      // Stop after fewer iterations on mobile
      if (drops.filter((d) => d > (isMobile ? 8 : 15)).length > columns * 0.8) {
        clearInterval(interval);
        terminal.writeln('\x1b[0m\r\n\r\nMatrix simulation complete.\r\n');
        terminal.write('~/neo-portfolio $ ');
      }
    }, isMobile ? 200 : 150); // Slower on mobile for better performance
  };

  // Get available commands based on admin status
  const getAvailableCommands = () => {
    const baseCommands = ['help', 'about', 'skills', 'projects', 'contact', 'clear', 'exit', 'matrix', 'hack', 'game', 'accent', 'sudo', 'todo', 'addTodo', 'listTodo', 'completeTodo', 'deleteTodo'];
    return isAdmin ? [...baseCommands, 'system', 'decrypt', 'network', 'override', 'todoAdmin'] : baseCommands;
  };

  return (
    <div className="fixed inset-0 bg-[#070707] z-50 animate-slide-in p-4 flex flex-col">
      <div ref={terminalRef} id="terminal" className="w-full flex-grow overflow-hidden rounded-md" />
      
      {/* Mobile input interface */}
      {isMobile && (
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="flex">
            <span className={`hidden md:inline-block text-${getThemeColor(accentColor)} mr-2`}>
              {isPasswordPrompt ? 'Password: ' : '~/neo-portfolio }
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
                className={`px-3 py-1 text-sm border ${
                  ['system', 'decrypt', 'network', 'override', 'todoAdmin'].includes(cmd) 
                    ? `border-${getThemeColor(accentColor)} text-${getThemeColor(accentColor)}` 
                    : 'border-gray-700'
                } rounded hover:border-gray-500`}
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Admin indicator */}
      {isAdmin && (
        <div className={`absolute top-2 left-500 px-3 py-1 text-sm rounded-full bg-${getThemeColor(accentColor)} bg-opacity-20 border border-${getThemeColor(accentColor)} text-${getThemeColor(accentColor)}`}>
          Admin
        </div>
      )}
    </div>
  );
};

export default Terminal;