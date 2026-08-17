# CoreFix — Security Review

Revisão aplicada em 2026-08-17 ao site principal e às demos de ar-condicionado, oficina mecânica e eletricista.

## Escopo

- HTML, CSS e JavaScript estáticos.
- Links externos e integrações com WhatsApp.
- Formulários client-side.
- Políticas de segurança no navegador.
- Proteção contra indexação indevida das demos fictícias.
- Referências locais, caminhos e recursos externos.

## Resultado

Nenhuma vulnerabilidade crítica ou alta foi identificada no código estático revisado. Não há backend, autenticação, banco de dados, upload de arquivos, cookies de sessão ou API própria neste repositório.

### 1. DOM/XSS — baixo risco após revisão

Não foram encontrados usos de `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function` ou URLs `javascript:`. Os dados digitados nos formulários são usados apenas para compor uma URL do WhatsApp com `encodeURIComponent`, sem serem reinseridos como HTML na página.

Aplicado:

- limites `maxlength` nos principais campos de texto;
- limite defensivo no tamanho da mensagem antes de gerar a URL do WhatsApp;
- validação do número de WhatsApp configurado nas demos;
- nenhuma interpolação de entrada do visitante em HTML executável.

### 2. Content Security Policy (CSP) — endurecida

Foi adicionada CSP via `<meta http-equiv="Content-Security-Policy">` em todas as páginas, útil inclusive em hospedagens que não aplicam arquivos de configuração de headers.

Para produção, `_headers` e `.htaccess` também definem CSP por HTTP. A política:

- bloqueia plugins/objetos (`object-src 'none'`);
- bloqueia `<base>` injetado (`base-uri 'none'`);
- permite scripts apenas do próprio site e hashes explícitos do JSON-LD inline;
- não utiliza `unsafe-inline` nem `unsafe-eval` para JavaScript;
- restringe CSS, fontes e imagens aos domínios efetivamente utilizados;
- impede carregamento em frames por terceiros via `frame-ancestors 'none'` no header;
- limita submissões de formulário ao próprio site e WhatsApp.

### 3. Clickjacking e headers HTTP — corrigido

Arquivos de configuração agora incluem:

- `Content-Security-Policy` com `frame-ancestors 'none'`;
- `X-Frame-Options: DENY`;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy` desabilitando câmera, microfone, geolocalização, pagamentos e USB;
- `Cross-Origin-Opener-Policy: same-origin-allow-popups`;
- `X-Permitted-Cross-Domain-Policies: none`;
- `Strict-Transport-Security: max-age=31536000`.

Observação: HSTS só é efetivo quando o site é servido por HTTPS.

### 4. Links externos — revisados

Todos os links encontrados com `target="_blank"` possuem proteção `rel="noopener noreferrer"`. Links gerados via JavaScript também usam `noopener,noreferrer`.

Não foram encontradas referências `http://` em `src` ou `href`.

### 5. Dependência externa do Font Awesome — endurecida

O Font Awesome utilizado pelo site principal permanece fixado na versão 6.5.1, porém agora utiliza Subresource Integrity (SRI), `crossorigin="anonymous"` e `referrerpolicy="no-referrer"`.

### 6. Demos fictícias — proteção reforçada

As três demos possuem `noindex,nofollow,noarchive` no HTML. O `_headers` também envia `X-Robots-Tag: noindex, nofollow, noarchive` para `/demos/*` quando usado por uma hospedagem compatível.

O canonical da demo de eletricista, que apontava para `exemplo.com`, foi corrigido para o domínio da CoreFix.

### 7. Formulários e privacidade

Os formulários não possuem backend neste projeto. Após submissão, o JavaScript monta uma mensagem e abre o WhatsApp. Nenhuma rotina encontrada grava os campos em `localStorage`, `sessionStorage`, cookies ou servidor próprio.

Isso não elimina o tratamento de dados pelo WhatsApp após o visitante decidir continuar para a plataforma externa.

### 8. CORS

Não foi adicionada política CORS permissiva. O projeto não expõe API própria que precise ser consumida por outros domínios. Adicionar `Access-Control-Allow-Origin: *` sem necessidade reduziria o isolamento sem benefício atual.

## Riscos residuais / recomendações

### Dependências e recursos externos

O site ainda carrega alguns recursos de terceiros:

- Google Fonts no site principal e na demo de eletricista;
- Font Awesome via cdnjs no site principal;
- imagens da Pexels na demo de ar-condicionado.

A CSP limita esses recursos aos hosts esperados e o Font Awesome possui SRI. Para uma política de privacidade e supply-chain ainda mais rígida, uma futura versão pode hospedar fontes, ícones e imagens localmente e remover essas origens da CSP.

### Headers dependem da hospedagem

- `_headers` deve ser suportado/configurado pela plataforma de hospedagem para surtir efeito.
- `.htaccess` requer Apache com `mod_headers`.
- em outras plataformas, replique os mesmos headers na configuração correspondente.
- a CSP via meta continua sendo uma camada adicional, mas não substitui todos os headers HTTP (por exemplo `frame-ancestors` e HSTS).

### HTTPS

Publicar apenas em HTTPS e manter redirecionamento HTTP → HTTPS. Não adicionar `includeSubDomains` ou `preload` ao HSTS sem confirmar que todos os subdomínios são permanentemente HTTPS.

## Validações executadas

- `node --check` em todos os arquivos JavaScript: aprovado.
- busca por sinks DOM perigosos e execução dinâmica: nenhum encontrado.
- busca por links `target="_blank"` sem `noopener`: nenhum encontrado.
- busca por links `http://`: nenhum encontrado.
- validação de todos os caminhos locais `href`/`src`: aprovado.
- validação das âncoras internas: aprovado.
- validação das referências `url()` locais de CSS: aprovado.
- validação dos hashes CSP para JSON-LD inline: aprovado.
- validação do ZIP final: executada antes da entrega.

## Limitações da revisão

Esta é uma auditoria estática e de hardening do código fornecido, não um pentest de infraestrutura. DNS, TLS, servidor web, painel de hospedagem, contas administrativas, CI/CD e configurações reais do provedor não estão presentes no ZIP e devem ser avaliados separadamente no ambiente publicado.

Uma tentativa complementar de renderização automatizada com Chromium headless não concluiu de forma confiável neste ambiente por timeout do navegador; por isso, ela não é contabilizada como teste aprovado. As verificações estáticas e de sintaxe acima foram concluídas com sucesso.
