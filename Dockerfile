# Build Stage
FROM node:22-alpine AS builder

# pnpm installieren
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Package files kopieren
COPY package.json pnpm-lock.yaml ./

# Dependencies installieren
RUN pnpm install --frozen-lockfile

# Source Code kopieren
COPY . .

# Production Build
RUN pnpm build:prod

# Production Stage
FROM nginx:alpine AS production

# Custom nginx config kopieren
COPY nginx.conf /etc/nginx/nginx.conf

# SSL Zertifikate kopieren (selbst-signiert für Entwicklung)
COPY ssl/server.crt /etc/nginx/ssl/server.crt
COPY ssl/server.key /etc/nginx/ssl/server.key

# Build Artefakte kopieren
COPY --from=builder /app/dist/swe-ws25-frontend/browser /usr/share/nginx/html

# Port 443 für HTTPS
EXPOSE 443

# nginx starten
CMD ["nginx", "-g", "daemon off;"]
