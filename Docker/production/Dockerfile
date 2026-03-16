
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

RUN npx prisma generate
RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app
# Variables de entorno para producción
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

#configuración de usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Crear carpeta .next y darle permisos al usuario nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Optimización: Copiar SOLO los archivos estáticos y el servidor independiente (Standalone)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar al usuario seguro
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]