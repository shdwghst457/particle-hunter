# Particle Hunter — static site served by nginx
FROM nginx:alpine

# Copy the app into nginx's default serve directory
COPY index.html /usr/share/nginx/html/index.html

# Expose port 80 inside the container
EXPOSE 80
