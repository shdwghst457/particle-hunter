# Particle Hunter — static site served by nginx
FROM nginx:alpine

# Copy app code into /app
COPY index.html /app/index.html

# Drop in custom nginx config (listens on 8082, serves from /app)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port
EXPOSE 8082

# nginx runs automatically — no CMD needed
