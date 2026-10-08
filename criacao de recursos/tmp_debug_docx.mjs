import fs from 'fs';

const documentXml = fs.readFileSync('tmp_docx_extract/word/document.xml', 'utf8');
const relsXml = fs.readFileSync('tmp_docx_extract/word/_rels/document.xml.rels', 'utf8');
const commentsXml = fs.readFileSync('tmp_docx_extract/word/comments.xml', 'utf8');

// Map rId to Target (filename)
const rels = {};
const relMatches = relsXml.matchAll(/Id="([^"]+)"[^>]+Target="([^"]+)"/g);
for (const match of relMatches) {
    rels[match[1]] = match[2];
}

// Map comment id to text
const comments = {};
const commentMatches = commentsXml.matchAll(/<w:comment[^>]+w:id="([^"]+)"[^>]*>([\s\S]*?)<\/w:comment>/g);
for (const match of commentMatches) {
    const id = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    comments[id] = text;
}

// Parse document.xml for paragraphs, images, and comment markers
// This is a bit complex with regex but let's try to find the sequence.
// We look for <w:p> (paragraphs)
const paragraphs = documentXml.matchAll(/<w:p [^>]*>([\s\S]*?)<\/w:p>/g);
let sequence = [];

for (const pMatch of paragraphs) {
    const pContent = pMatch[1];
    
    // Check for comments in this paragraph
    const commentRangeStart = pContent.match(/<w:commentRangeStart w:id="([^"]+)"/);
    if (commentRangeStart) {
        sequence.push({ type: 'comment', id: commentRangeStart[1], text: comments[commentRangeStart[1]] });
    }

    // Check for images
    const drawingMatches = pContent.matchAll(/<w:drawing>[\s\S]*?r:embed="([^"]+)"/g);
    for (const dMatch of drawingMatches) {
        const rId = dMatch[1];
        sequence.push({ type: 'image', rId: rId, file: rels[rId] });
    }

    // Text content
    const text = pContent.replace(/<[^>]+>/g, '').trim();
    if (text) {
        sequence.push({ type: 'text', text: text });
    }
}

console.log(JSON.stringify(sequence, null, 2));
