export interface AboutPaperOptions {
  name?: string;
  headline?: string;
  location?: string;
  status?: string;
  aboutText?: string;
  skills?: string[];
}

export function generateAboutPaperDataUrl(options: AboutPaperOptions = {}): string {
  if (typeof document === 'undefined') return '';

  // Ultra-High-Definition 4K Canvas (2200 x 2840) for ultra-sharp typography
  const width = 2200;
  const height = 2840;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return '';

  // Optimize canvas text rendering for pristine sharpness
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const name = options.name || 'Bilal Ahamed';
  const headline = options.headline || 'AI & Full-Stack Developer • M.Tech Scholar';
  const location = options.location || 'Kerala, India';
  const status = options.status || 'Open to Opportunities & Collaborations';
  const aboutText =
    options.aboutText ||
    'M.Tech Computer Science and Engineering (AI & Data Science) student at Cochin University of Science and Technology with hands-on experience in full-stack development, Artificial Intelligence, Machine Learning, cloud technologies, and real-time applications. Skilled in Python, React, Firebase, AWS, and Google Cloud Platform, with experience developing AI-powered applications using OpenAI technologies. Proficient in AI coding tools, prompt engineering, database integration, debugging, testing, deployment, and collaborative software development.';

  const skills = options.skills || [
    'Generative AI & LLMs',
    'Python & FastAPI',
    'React & Next.js',
    'TypeScript',
    'PyTorch & LangChain',
    'Cloud Systems (GCP / AWS)',
    'Realtime Systems & Firebase',
    'Prompt Engineering',
  ];

  // 1. Natural Paper Surface (Warm, clean, authentic ivory tone with no bounding borders)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#fdfcf7');
  bgGrad.addColorStop(0.4, '#faf7ee');
  bgGrad.addColorStop(1, '#f4efe3');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle natural paper grain
  ctx.fillStyle = 'rgba(90, 80, 60, 0.015)';
  for (let i = 0; i < 15000; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // 2. Header Section
  let curY = 180;

  ctx.textAlign = 'center';
  ctx.fillStyle = '#4e6446';
  ctx.font = '700 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('EXECUTIVE PROFILE & DOSSIER', width / 2, curY);
  ctx.letterSpacing = '0px';

  curY += 100;
  ctx.fillStyle = '#0f1c0e';
  ctx.font = 'bold 112px "Playfair Display", "Times New Roman", Georgia, serif';
  ctx.fillText(name, width / 2, curY);

  curY += 65;
  ctx.fillStyle = '#374d32';
  ctx.font = '600 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(headline, width / 2, curY);

  curY += 54;
  ctx.fillStyle = '#52694d';
  ctx.font = '500 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`📍 ${location}    •    🎓 CUSAT Scholar    •    🟢 ${status}`, width / 2, curY);

  // Elegant subtle ink separator rule
  curY += 65;
  ctx.strokeStyle = 'rgba(90, 110, 80, 0.35)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(220, curY);
  ctx.lineTo(width - 220, curY);
  ctx.stroke();

  // Diamond center ornament
  ctx.fillStyle = '#5a7350';
  ctx.beginPath();
  ctx.moveTo(width / 2, curY - 12);
  ctx.lineTo(width / 2 + 12, curY);
  ctx.lineTo(width / 2, curY + 12);
  ctx.lineTo(width / 2 - 12, curY);
  ctx.closePath();
  ctx.fill();

  // 3. Biography & Narrative Section
  curY += 120;
  ctx.textAlign = 'left';

  ctx.fillStyle = '#506847';
  ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('BIOGRAPHY & ENGINEERING VISION', 160, curY);
  ctx.letterSpacing = '0px';

  curY += 75;
  ctx.fillStyle = '#111e10';
  ctx.font = '400 46px/1.8 "Merriweather", "Georgia", "Times New Roman", serif';

  // 4K Word Wrap with crisp line-height
  const maxWidth = width - 320;
  const lineHeight = 80;
  const words = aboutText.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, 160, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 160, curY);

  // 4. Core Technical Focus & Skill Badges
  curY += 125;
  ctx.fillStyle = '#506847';
  ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('CORE TECHNICAL FOCUS & SPECIALIZATIONS', 160, curY);
  ctx.letterSpacing = '0px';

  curY += 60;
  let pillX = 160;
  let pillY = curY;
  ctx.font = '600 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  skills.forEach((skill) => {
    const textWidth = ctx.measureText(skill).width;
    const pillWidth = textWidth + 70;
    const pillHeight = 84;

    if (pillX + pillWidth > width - 160) {
      pillX = 160;
      pillY += 110;
    }

    // Skill Pill background
    ctx.fillStyle = 'rgba(230, 240, 222, 0.95)';
    ctx.strokeStyle = 'rgba(95, 120, 85, 0.45)';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 22);
    ctx.fill();
    ctx.stroke();

    // Skill Pill text
    ctx.fillStyle = '#1c2d1b';
    ctx.fillText(skill, pillX + 35, pillY + 54);

    pillX += pillWidth + 24;
  });

  // 5. Bottom Footer Note, Signature & Certified Stamp
  const bottomY = height - 210;

  // Left Note
  ctx.fillStyle = '#4c6246';
  ctx.font = 'italic 32px "Georgia", serif';
  ctx.fillText('Crafting intelligent, scalable systems with passion & precision.', 160, bottomY - 15);
  ctx.font = '600 28px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#2d4029';
  ctx.fillText('CUSAT AI & Data Science Scholar', 160, bottomY + 35);

  // Right Signature
  ctx.textAlign = 'right';
  ctx.font = 'italic 86px "Brush Script MT", "Caveat", "Dancing Script", cursive, "Playfair Display"';
  ctx.fillStyle = '#0f1d0e';
  ctx.fillText('Bilal Ahamed', width - 160, bottomY + 10);

  ctx.font = '700 24px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#5c7553';
  ctx.letterSpacing = '3px';
  ctx.fillText('AUTHENTICATED PORTFOLIO DOCUMENT', width - 160, bottomY + 58);
  ctx.letterSpacing = '0px';

  // Embossed Seal on bottom right corner
  const sealX = width - 680;
  const sealY = bottomY;

  ctx.beginPath();
  ctx.arc(sealX, sealY, 58, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(95, 120, 85, 0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(95, 120, 85, 0.5)';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#374d32';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('CUSAT', sealX, sealY - 12);
  ctx.fillText('M.TECH', sealX, sealY + 14);
  ctx.fillText('SCHOLAR', sealX, sealY + 38);

  return canvas.toDataURL('image/png');
}
