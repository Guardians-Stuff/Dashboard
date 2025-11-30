/**
 * Logger utility with colored terminal output and professional formatting
 */

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    
    // Text colors
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    
    // Background colors
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
};

// Unicode symbols
const symbols = {
    checkmark: '✓',
    cross: '✗',
    arrow: '→',
    warning: '⚠',
    info: 'ℹ',
    alert: '⚡',
    box: {
        topLeft: '┌',
        topRight: '┐',
        bottomLeft: '└',
        bottomRight: '┘',
        horizontal: '─',
        vertical: '│',
        cross: '┼',
        tLeft: '├',
        tRight: '┤',
        tTop: '┬',
        tBottom: '┴'
    }
};

/**
 * Get formatted timestamp
 */
function getTimestamp() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * Create a box around text
 */
function createBox(title, content, color) {
    const contentStr = typeof content === 'string' ? content : String(content);
    const contentLines = contentStr.split('\n');
    const maxLineLength = Math.max(...contentLines.map(line => line.length));
    const width = Math.max(60, Math.max(title.length, maxLineLength) + 4);
    
    const top = `${color}${symbols.box.topLeft}${symbols.box.horizontal.repeat(width - 2)}${symbols.box.topRight}${colors.reset}`;
    const titleLine = `${color}${symbols.box.vertical}${colors.reset} ${colors.bright}${title}${colors.reset}${' '.repeat(Math.max(0, width - title.length - 3))}${color}${symbols.box.vertical}${colors.reset}`;
    const separator = `${color}${symbols.box.tLeft}${symbols.box.horizontal.repeat(width - 2)}${symbols.box.tRight}${colors.reset}`;
    const formattedContentLines = contentLines.map(line => {
        const padding = Math.max(0, width - line.length - 3);
        return `${color}${symbols.box.vertical}${colors.reset} ${line}${' '.repeat(padding)}${color}${symbols.box.vertical}${colors.reset}`;
    });
    const bottom = `${color}${symbols.box.bottomLeft}${symbols.box.horizontal.repeat(width - 2)}${symbols.box.bottomRight}${colors.reset}`;
    
    return [top, titleLine, separator, ...formattedContentLines, bottom].join('\n');
}

/**
 * Format message with colors, symbols, and boxes
 */
function formatMessage(symbol, tag, color, bgColor, message, ...args) {
    const timestamp = `${colors.dim}[${getTimestamp()}]${colors.reset}`;
    const symbolFormatted = `${color}${symbol}${colors.reset}`;
    const tagFormatted = `${bgColor}${colors.bright}${colors.white} ${tag} ${colors.reset}`;
    const messageFormatted = `${color}${message}${colors.reset}`;
    
    const argsFormatted = args.length > 0 ? args.map(arg => {
        if (typeof arg === 'object') {
            return JSON.stringify(arg, null, 2);
        }
        return String(arg);
    }).join(' ') : '';
    
    return `${timestamp} ${symbolFormatted} ${tagFormatted} ${messageFormatted}${argsFormatted ? ' ' + argsFormatted : ''}`;
}

/**
 * Format columns for tabular data
 */
function formatColumns(data, headers = null) {
    if (!data || data.length === 0) return '';
    
    const allRows = headers ? [headers, ...data] : data;
    const colWidths = allRows[0].map((_, colIndex) => 
        Math.max(...allRows.map(row => String(row[colIndex] || '').length))
    );
    
    const separator = `${colors.dim}${symbols.box.tLeft}${colWidths.map(w => symbols.box.horizontal.repeat(w + 2)).join(symbols.box.tTop)}${symbols.box.tRight}${colors.reset}`;
    
    const formatRow = (row, isHeader = false) => {
        const cells = row.map((cell, i) => {
            const content = String(cell || '').padEnd(colWidths[i]);
            return isHeader ? `${colors.bright}${content}${colors.reset}` : content;
        });
        return `${colors.dim}${symbols.box.vertical}${colors.reset} ${cells.join(` ${colors.dim}${symbols.box.vertical}${colors.reset} `)} ${colors.dim}${symbols.box.vertical}${colors.reset}`;
    };
    
    const top = `${colors.dim}${symbols.box.topLeft}${colWidths.map(w => symbols.box.horizontal.repeat(w + 2)).join(symbols.box.tTop)}${symbols.box.topRight}${colors.reset}`;
    const rows = allRows.map((row, i) => formatRow(row, headers && i === 0));
    const bottom = `${colors.dim}${symbols.box.bottomLeft}${colWidths.map(w => symbols.box.horizontal.repeat(w + 2)).join(symbols.box.tBottom)}${symbols.box.bottomRight}${colors.reset}`;
    
    return [top, ...rows, bottom].join('\n');
}

const logger = {
    /**
     * Info log - blue with info symbol
     */
    info: (message, ...args) => {
        console.log(formatMessage(symbols.info, '[INFO]', colors.blue, colors.bgBlue, message, ...args));
    },
    
    /**
     * Success log - green with checkmark
     */
    success: (message, ...args) => {
        console.log(formatMessage(symbols.checkmark, '[SUCCESS]', colors.green, colors.bgGreen, message, ...args));
    },
    
    /**
     * Warning log - yellow with warning symbol
     */
    warn: (message, ...args) => {
        console.warn(formatMessage(symbols.warning, '[WARN]', colors.yellow, colors.bgYellow, message, ...args));
    },
    
    /**
     * Error log - red with cross
     */
    error: (message, ...args) => {
        console.error(formatMessage(symbols.cross, '[ERROR]', colors.red, colors.bgRed, message, ...args));
    },
    
    /**
     * Alert log - magenta with alert symbol
     */
    alert: (message, ...args) => {
        console.log(formatMessage(symbols.alert, '[ALERT]', colors.magenta, colors.bgMagenta, message, ...args));
    },
    
    /**
     * Debug log - cyan (only in development)
     */
    debug: (message, ...args) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(formatMessage(symbols.info, '[DEBUG]', colors.cyan, colors.bgCyan, message, ...args));
        }
    },
    
    /**
     * HTTP request log with formatted columns
     */
    http: (method, path, status, duration) => {
        const statusColor = status >= 500 ? colors.red : 
                           status >= 400 ? colors.yellow : 
                           status >= 300 ? colors.cyan : 
                           colors.green;
        const statusSymbol = status >= 500 ? symbols.cross : 
                            status >= 400 ? symbols.warning : 
                            status >= 300 ? symbols.arrow : 
                            symbols.checkmark;
        const statusText = `${statusColor}${statusSymbol} ${status}${colors.reset}`;
        
        const methodColor = method === 'GET' ? colors.blue : 
                           method === 'POST' ? colors.green : 
                           method === 'PUT' ? colors.yellow : 
                           method === 'DELETE' ? colors.red : 
                           colors.white;
        const methodText = `${methodColor}${method.padEnd(6)}${colors.reset}`;
        const durationText = duration ? `${colors.dim}(${duration}ms)${colors.reset}` : '';
        const pathText = `${colors.cyan}${path}${colors.reset}`;
        
        console.log(`${colors.dim}[${getTimestamp()}]${colors.reset} ${colors.bgBlue}${colors.bright}${colors.white} [HTTP] ${colors.reset} ${methodText} ${pathText} ${statusText} ${durationText}`);
    },
    
    /**
     * API log with formatted output
     */
    api: (endpoint, status, message) => {
        const statusColor = status >= 500 ? colors.red : 
                           status >= 400 ? colors.yellow : 
                           colors.green;
        const statusSymbol = status >= 500 ? symbols.cross : 
                            status >= 400 ? symbols.warning : 
                            symbols.checkmark;
        const statusText = `${statusColor}${statusSymbol} ${status}${colors.reset}`;
        const endpointText = `${colors.cyan}${endpoint}${colors.reset}`;
        const messageText = message ? `${colors.dim}→${colors.reset} ${colors.white}${message}${colors.reset}` : '';
        
        console.log(`${colors.dim}[${getTimestamp()}]${colors.reset} ${colors.bgCyan}${colors.bright}${colors.white} [API] ${colors.reset} ${endpointText} ${statusText} ${messageText}`);
    },
    
    /**
     * Create a boxed message
     */
    box: (title, content, color = colors.blue) => {
        console.log('\n' + createBox(title, content, color) + '\n');
    },
    
    /**
     * Display data in a table format
     */
    table: (data, headers = null) => {
        console.log('\n' + formatColumns(data, headers) + '\n');
    },
    
    /**
     * Display server startup information in a nice box
     */
    startup: (info) => {
        const lines = [
            `${colors.bright}${colors.green}${symbols.checkmark}${colors.reset} Server initialized`,
            `${colors.bright}${colors.blue}${symbols.info}${colors.reset} Protocol: ${info.protocol.toUpperCase()}`,
            `${colors.bright}${colors.blue}${symbols.info}${colors.reset} Hostname: ${info.hostname}`,
            `${colors.bright}${colors.blue}${symbols.info}${colors.reset} Environment: ${info.environment}`,
            `${colors.bright}${colors.blue}${symbols.info}${colors.reset} Port: ${info.port}`,
            `${colors.bright}${colors.green}${symbols.checkmark}${colors.reset} Ready in ${info.startupTime}ms`
        ];
        console.log('\n' + createBox('🚀 Server Status', lines.join('\n'), colors.green) + '\n');
    }
};

// Support both CommonJS and ES6
module.exports = logger;
export default logger;

