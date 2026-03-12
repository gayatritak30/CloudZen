
const fs = require('fs');
const path = require('path');

const filePath = path.join('C:', 'Users', 'lalev', 'Downloads', 'CodeZen-main', 'CodeZen-main', 'lib', 'data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The corruption looks like this (multiple lines):
// options: [
//           "A",
//           "B",
//           "C",
//           "D",
//         
//     ],
//         correctAnswer: ...

// Regex to find the corrupted options array with multi-line support
const corruptionRegex = /options:\s*\[\s*([\s\S]*?)\s*\n\s*\]\s*,\s*\n\s*correctAnswer:/g;

const fixedContent = content.replace(corruptionRegex, (match, optionsContent) => {
    // Check if the optionsContent is missing its closing comma or has trailing whitespace
    // We want to ensure it ends with a comma if it's multi-line, or just close it.
    
    // If there's an extra bracket at the end of the match (the one we captured in match), 
    // we should reconstruct it properly.
    
    // Trim the options content
    let trimmed = optionsContent.trim();
    if (trimmed.endsWith(',')) {
        // It might already have a comma but the ] was on the wrong line
    } else {
        // Add a comma if it's missing (though some style guides don't require it for the last item)
        // But here it seems it was cut off.
    }
    
    return `options: [\n          ${trimmed}\n        ],\n        correctAnswer:`;
});

fs.writeFileSync(filePath, fixedContent, 'utf8');
console.log('Fixed multi-line corrupted options arrays.');
