/* CoreFix Tech V2.2 - local PDF export using the PDF 1.4 standard (no CDN). */
(() => {
  'use strict';
  const button = document.getElementById('sim-pdf');
  if (!button) return;
  const pageW = 595.28;
  const pageH = 841.89;
  const letterMap = Object.freeze({
    0x20ac:0x80,0x201a:0x82,0x0192:0x83,0x201e:0x84,0x2026:0x85,
    0x2020:0x86,0x2021:0x87,0x02c6:0x88,0x2030:0x89,0x0160:0x8a,
    0x2039:0x8b,0x0152:0x8c,0x017d:0x8e,0x2018:0x91,0x2019:0x92,
    0x201c:0x93,0x201d:0x94,0x2022:0x95,0x2013:0x96,0x2014:0x97,
    0x02dc:0x98,0x2122:0x99,0x0161:0x9a,0x203a:0x9b,0x0153:0x9c,
    0x017e:0x9e,0x0178:0x9f
  });
  function toWinAnsi(value) {
    let out = '';
    for (const ch of String(value || '')) {
      const cp = ch.codePointAt(0);
      const mapped = (cp >= 32 && cp < 127) || (cp >= 160 && cp <= 255) ? cp : (letterMap[cp] || 63);
      out += String.fromCharCode(mapped);
    }
    return out;
  }
  const pdfString = value => '(' + toWinAnsi(value).replace(/[\\()]/g,'\\$&') + ')';
  function buildPdf(details) {
    const streams = [];
    let instructions = [];
    let y = 690;
    const money = details.price === null
      ? 'Sob consulta'
      : 'A partir de ' + new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(details.price);
    const clean = value => String(value || '').replace(/[\r\n\t]+/g,' ').trim();
    const fill = (r,g,b) => `${r} ${g} ${b}`;
    const text = (content,x,yPos,size=10.5,bold=false,color='0.13 0.21 0.19') => {
      instructions.push(`BT /F${bold?'2':'1'} ${size} Tf ${color} rg 1 0 0 1 ${x.toFixed(2)} ${yPos.toFixed(2)} Tm ${pdfString(content)} Tj ET\n`);
    };
    const rect = (x,ry,w,h,color) => instructions.push(`${color} rg ${x.toFixed(2)} ${ry.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f\n`);
    function header() {
      rect(0,720,pageW,122,fill(0.06,0.14,0.12));
      rect(49,758,5,45,fill(0.75,0.94,0.52));
      text('COREFIX TECH',68,791,16,true,'1 1 1');
      text('EST\u00daDIO DIGITAL  /  CRIA\u00c7\u00c3O DE SITES',68,772,8.5,false,'0.76 0.90 0.76');
      text('PROPOSTA INICIAL DE SITE',49,742,13,true,'1 1 1');
      text('Documento orientativo para avalia\u00e7\u00e3o do escopo',49,706,9,false,'0.37 0.45 0.43');
      text(new Date().toLocaleDateString('pt-BR'),486,706,9,true,'0.37 0.45 0.43');
      y = 681;
    }
    function footer() {
      rect(49,65,pageW-98,1,fill(0.84,0.88,0.85));
      text('www.corefixtech.com.br  |  WhatsApp: (41) 99851-1625',49,48,8.4,false,'0.32 0.42 0.37');
      text('Pr\u00e9-or\u00e7amento - n\u00e3o constitui contrato ou oferta definitiva.',49,32,8,false,'0.46 0.51 0.48');
    }
    function newPage() {
      if (instructions.length) {footer(); streams.push(instructions.join(''));}
      instructions = [];
      header();
    }
    function ensure(space) {if (y - space < 86) newPage();}
    function section(title) {
      ensure(58);
      rect(49,y-2,11,3,fill(0.35,0.59,0.44));
      text(title.toUpperCase(),69,y-3,10.2,true,'0.11 0.26 0.20');
      y -= 25;
    }
    function wrap(value, maxChars=82) {
      const out = [];
      let line = '';
      for (const originalWord of clean(value).split(/\s+/)) {
        if (!originalWord) continue;
        const pieces = originalWord.match(new RegExp(`.{1,${maxChars}}`,'g')) || [''];
        for (const word of pieces) {
          if (!line) line = word;
          else if (line.length + word.length + 1 <= maxChars) line += ' ' + word;
          else {out.push(line);line=word;}
        }
      }
      if (line) out.push(line);
      return out.length ? out : ['N\u00e3o informado'];
    }
    function field(label,value) {
      const lines=wrap(value,76);
      ensure(23+lines.length*13);
      text(label.toUpperCase(),50,y,8.7,true,'0.45 0.52 0.48');
      y-=15;
      for (const line of lines) {text(line,50,y,10.5,false);y-=14;}
      y-=6;
    }
    function bullet(value) {
      const lines=wrap(value,84);
      ensure(12+lines.length*14);
      rect(52,y-2.2,4,4,fill(0.20,0.55,0.38));
      for(const line of lines) {text(line,64,y,10,false);y-=14;}
      y-=4;
    }
    newPage();
    section('Dados do projeto');
    field('Empresa',details.company || 'A definir');
    field('Segmento',details.segmentLabel);
    field('Formato do site',details.planLabel);
    if (details.appearance) field('Paleta visual escolhida',details.appearance + ' - refer\u00eancia inicial');
    if (details.city) field('Cidade de atendimento',details.city);
    if (details.name) field('Contato',details.name);
    if (details.phone) field('Telefone informado',details.phone);
    section('O que esta inclu\u00eddo');
    for (const item of details.included) bullet(item);
    section('Funcionalidades para avaliar');
    if (details.extras.length) for (const item of details.extras) bullet(item + ' - sob consulta');
    else bullet('Nenhuma funcionalidade adicional solicitada nesta simula\u00e7\u00e3o.');
    section('Investimento de refer\u00eancia');
    ensure(67);
    rect(49,y-44,pageW-98,62,fill(0.94,0.98,0.92));
    text(money,63,y-9,19,true,'0.09 0.33 0.22');
    text('Valor inicial para o formato escolhido; sujeito \u00e0 an\u00e1lise do escopo.',63,y-28,9,false,'0.31 0.42 0.34');
    y -= 67;
    section('Condi\u00e7\u00f5es e pr\u00f3ximos passos');
    bullet('O valor final depende do conte\u00fado, n\u00famero de p\u00e1ginas, integra\u00e7\u00f5es e revis\u00f5es acordadas.');
    bullet('Dom\u00ednio, hospedagem, manuten\u00e7\u00e3o, prazos e suporte ser\u00e3o definidos em proposta posterior.');
    bullet('Converse com a CoreFix Tech pelo WhatsApp para esclarecer e aprovar o escopo.');
    footer();streams.push(instructions.join(''));

    const objs=['', '<< /Type /Catalog /Pages 2 0 R >>',null,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
    const pages=[];
    streams.forEach(stream=>{
      const pageId=objs.length;
      const streamId=pageId+1;
      pages.push(pageId);
      objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamId} 0 R >>`);
      objs.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    });
    objs[2]=`<< /Type /Pages /Kids [${pages.map(id=>id+' 0 R').join(' ')}] /Count ${pages.length} >>`;
    let output='%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    const offsets=[0];
    for(let i=1;i<objs.length;i++) {
      offsets.push(output.length);
      output+=`${i} 0 obj\n${objs[i]}\nendobj\n`;
    }
    const xref=output.length;
    output+=`xref\n0 ${objs.length}\n0000000000 65535 f \n`;
    for(let i=1;i<objs.length;i++) output+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
    output+=`trailer\n<< /Size ${objs.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return new Uint8Array(Array.from(output, c=>c.charCodeAt(0)));
  }
  button.addEventListener('click', () => {
    const details=window.CoreFixTechBriefing?.getDetails();
    if (!details) return;
    const bytes=buildPdf(details);
    const blob=new Blob([bytes],{type:'application/pdf'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    const title=(details.company||details.segmentLabel||'Projeto').normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,44);
    link.href=url;
    link.download='CoreFix_Tech_Proposta_Inicial_'+(title||'Projeto')+'.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),5000);
    const feedback=document.getElementById('sim-feedback');
    if (feedback) feedback.textContent='Proposta PDF preparada no seu navegador. Confira a pasta de downloads.';
  });
})();
