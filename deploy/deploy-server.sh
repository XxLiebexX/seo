#!/usr/bin/env bash
set -e

echo "=========================================="
echo "🚀 Deploying SEO Content Optimiser (App)"
echo "   Target: app.seocontentoptimiser.in"
echo "=========================================="

APP_DIR="/var/www/seo"
BACKEND_DIR="$APP_DIR/backend"
DIST_DIR="$APP_DIR/dist"
VENV_DIR="$BACKEND_DIR/venv"
NGINX_CONF="/etc/nginx/sites-available/app.seocontentoptimiser.in"
NGINX_ENABLED="/etc/nginx/sites-enabled/app.seocontentoptimiser.in"

# 1. Check Directory Ownership & Permissions
echo "==> Setting directory permissions..."
sudo mkdir -p "$APP_DIR" "$DIST_DIR" "$BACKEND_DIR"
sudo chown -R ubuntu:www-data "$APP_DIR"

# 2. Setup / Update Python Virtual Environment
echo "==> Checking Python virtual environment in $VENV_DIR..."
if [ ! -d "$VENV_DIR" ]; then
    echo "Creating new virtual environment with python3..."
    python3 -m venv "$VENV_DIR"
fi

echo "==> Updating backend requirements..."
"$VENV_DIR/bin/pip" install --upgrade pip
"$VENV_DIR/bin/pip" install -r "$BACKEND_DIR/requirements.txt"

# 3. Setup .env if not present
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo "==> Creating default .env configuration..."
    cat << 'EOF' > "$BACKEND_DIR/.env"
LLM_PROVIDER=groq
GROQ_API_KEY=
GEMINI_API_KEY=
SERPER_API_KEY=
DATABASE_URL=sqlite:///./data/seoul.db
CORS_ORIGINS=["https://app.seocontentoptimiser.in","https://seocontentoptimiser.in","http://localhost:5173"]
RATE_LIMIT_PER_HOUR=30
LOG_LEVEL=INFO
EMBEDDER=sbert
GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_MODEL=gemini-2.0-flash
MAX_CONCURRENT_ANALYSES=2
TRUSTED_PROXY_HOPS=2
BLOCK_PRIVATE_HOSTS=true
EOF
fi

# Ensure CORS_ORIGINS in .env is valid JSON
if grep -q 'CORS_ORIGINS=http' "$BACKEND_DIR/.env" 2>/dev/null; then
    sed -i 's|CORS_ORIGINS=.*|CORS_ORIGINS=["https://app.seocontentoptimiser.in","https://seocontentoptimiser.in","http://localhost:5173"]|' "$BACKEND_DIR/.env"
fi

# 4. Start / Restart PM2 Process
echo "==> Configuring PM2 process for FastAPI..."
if pm2 describe seo-backend > /dev/null 2>&1; then
    echo "Restarting existing PM2 process 'seo-backend'..."
    pm2 restart seo-backend --update-env
else
    echo "Starting new PM2 process 'seo-backend'..."
    pm2 start "$VENV_DIR/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000" \
        --name "seo-backend" \
        --cwd "$BACKEND_DIR"
fi
pm2 save

# 5. Configure Nginx
echo "==> Configuring Nginx server block..."
sudo cp "$APP_DIR/deploy/nginx-app.seocontentoptimiser.in.conf" "$NGINX_CONF"
sudo ln -sf "$NGINX_CONF" "$NGINX_ENABLED"

echo "==> Testing Nginx configuration..."
sudo nginx -t

echo "==> Reloading Nginx..."
sudo systemctl reload nginx

# 6. Verify Health Endpoint
echo "==> Testing local FastAPI health check..."
sleep 2
HEALTH_CHECK=$(curl -s http://127.0.0.1:8000/api/health || true)
echo "Health check response: $HEALTH_CHECK"

echo "=========================================="
echo "✅ Deployment finished successfully!"
echo "   Frontend: https://app.seocontentoptimiser.in"
echo "   API Docs: https://app.seocontentoptimiser.in/api/docs"
echo "=========================================="
