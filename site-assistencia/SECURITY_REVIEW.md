# Security review

## CORS

This is a static website and does not expose a browser-consumed API in this repository. No `Access-Control-Allow-Origin` header was added, because a permissive CORS policy would increase exposure without solving a current requirement.

If an API is added later, configure CORS only on those API routes with an explicit origin allowlist, explicit methods, explicit headers, and no wildcard origin when credentials are used.

## Content Security Policy

The site now has a restrictive CSP in `_headers` and `.htaccess`, plus a fallback `<meta http-equiv="Content-Security-Policy">` in `index.html` for static hosts that do not apply header files.

Allowed external resources are limited to the services already used by the page:

- Google Fonts: stylesheet and font files.
- cdnjs: Font Awesome CSS and font files.
- jsDelivr: tsParticles script.
- Unsplash: public images.
- Google Maps: embedded map frame.
- WhatsApp: outbound form/navigation target.

## Clickjacking

The HTTP header configuration sets both `Content-Security-Policy: frame-ancestors 'none'` and `X-Frame-Options: DENY`. The CSP header is the modern control; `X-Frame-Options` is kept for older clients.

## X-Content-Type-Options

The HTTP header configuration sets `X-Content-Type-Options: nosniff`.

## External resources and SRI

Subresource Integrity was added to versioned CDN assets:

- Font Awesome `6.5.1` from cdnjs.
- tsParticles `2.12.0` from jsDelivr.

SRI was not added to Google Fonts because its CSS response can vary by browser and negotiated font format. The CSP keeps Google Fonts constrained to `fonts.googleapis.com` and `fonts.gstatic.com`.

SRI was not added to image or iframe resources; browser SRI is primarily useful for script and stylesheet subresources.

## Cache

No sensitive content was found in the static files. No `no-store` or private cache rule was added. If future pages include personal data, admin areas, tokens, or account-specific responses, apply `Cache-Control: no-store` only to those routes.
