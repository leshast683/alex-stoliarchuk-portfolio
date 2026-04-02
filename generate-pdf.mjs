import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

const BASE = 'https://alex-stoliarchuk-portfolio.vercel.app';
const browser = await puppeteer.launch();

async function scrollPage(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let current = 0;
      const step = 500;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        current += step;
        if (current >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
  await new Promise(r => setTimeout(r, 1500));
}

// 1. Capture SWC page as base64 screenshot
async function captureSWCScreenshot() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE}/swc-project`, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));
  await scrollPage(page);
  await page.addStyleTag({ content: `* { animation: none !important; transition: none !important; }` });
  await new Promise(r => setTimeout(r, 1000));
  const fullHeight = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewport({ width: 1440, height: fullHeight });
  await new Promise(r => setTimeout(r, 1000));
  const screenshot = await page.screenshot({ type: 'jpeg', quality: 90, fullPage: true });
  await page.close();
  return screenshot.toString('base64');
}

// 2. Capture main page with injected images between projects and contact
async function captureMain(swcBase64, radioBase64, priorityBase64) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));
  await scrollPage(page);

  // Inject images between projects and contact
  await page.evaluate((swc, radio, priority) => {
    const contactSection = document.querySelector('#contact');
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'padding: 2rem; background: #fff;';
    wrapper.innerHTML = `
      <img src="data:image/jpeg;base64,${swc}" style="width:100%;display:block;margin-bottom:2rem;" />
      <img src="data:image/jpeg;base64,${radio}" style="width:100%;display:block;margin-bottom:2rem;" />
      <img src="data:image/jpeg;base64,${priority}" style="width:100%;display:block;" />
    `;
    contactSection.parentNode.insertBefore(wrapper, contactSection);
  }, swcBase64, radioBase64, priorityBase64);

  await new Promise(r => setTimeout(r, 1500));

  await page.addStyleTag({ content: `
    * { animation: none !important; transition: none !important; }
    section { min-height: unset !important; padding-top: 2rem !important; padding-bottom: 2rem !important; }
    #home { padding-top: 1rem !important; padding-bottom: 0.5rem !important; }
    #projects { margin-top: 0 !important; padding-top: 1rem !important; }
    #contact { padding: 0 !important; }
    div[class*="about"] { min-height: unset !important; }
    div[class*="container"] { min-height: unset !important; }
    div[class*="resume"] { padding: 1rem 0 !important; margin-top: 0 !important; }
  `});
  await new Promise(r => setTimeout(r, 1000));

  const fullHeight = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewport({ width: 1440, height: fullHeight });
  await new Promise(r => setTimeout(r, 1000));

  const pdf = await page.pdf({ width: '1440px', height: `${fullHeight}px`, printBackground: true, pageRanges: '1', margin: { top: '0', bottom: '0', left: '0', right: '0' } });
  await page.close();
  return pdf;
}

// Read local images as base64
const radioBase64 = fs.readFileSync('/Users/alexstoliarchuk/Desktop/Portfolio-main/public/img/radio pdf.jpg').toString('base64');
const priorityBase64 = fs.readFileSync('/Users/alexstoliarchuk/Desktop/Portfolio-main/public/img/prioritypdf.jpg').toString('base64');

console.log('Capturing SWC screenshot...');
const swcBase64 = await captureSWCScreenshot();

console.log('Capturing main page with injected images...');
const mainPdf = await captureMain(swcBase64, radioBase64, priorityBase64);

await browser.close();

fs.writeFileSync('/Users/alexstoliarchuk/Desktop/portfolio.pdf', mainPdf);
console.log('PDF saved to Desktop');
