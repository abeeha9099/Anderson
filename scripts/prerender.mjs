// Injects the server-rendered homepage into dist/index.html, then removes the temporary SSR bundle.
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ssrEntry = pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href;
const { render } = await import(ssrEntry);

const file = path.resolve('dist/index.html');
const template = await readFile(file, 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('Placeholder <!--app-html--> not found in dist/index.html');

const html = template.replace('<!--app-html-->', render());
await writeFile(file, html);
await rm(path.resolve('dist-ssr'), { recursive: true, force: true });
console.log(`Pre-rendered dist/index.html (${(html.length / 1024).toFixed(1)} KB)`);
