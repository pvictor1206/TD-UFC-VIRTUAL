// Publica o build na RAIZ do repositório, para o GitHub Pages
// ("Deploy from a branch" -> main -> /root) servir o site compilado.
// O código-fonte usa app.html; o build gera dist/app.html, que vira index.html.
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dist = path.join(root, 'dist');

fs.copyFileSync(path.join(dist, 'app.html'), path.join(root, 'index.html'));
fs.rmSync(path.join(root, 'assets'), { recursive: true, force: true });
fs.cpSync(path.join(dist, 'assets'), path.join(root, 'assets'), { recursive: true });
console.log('Build publicado na raiz: index.html + assets/');
