# AIBLTY Backend - VPS Deployment Guide

Complete step-by-step instructions for deploying AIBLTY on an Ubuntu 22.04 VPS.

---

## Prerequisites

- Ubuntu 22.04 LTS VPS (DigitalOcean, HostUrServer, Linode, etc.)
- Root or sudo access
- Domain pointed to your VPS IP (e.g., `api.aiblty.com`)
- At least 2GB RAM, 1 vCPU, 25GB storage

---

## Step 1: Initial Server Setup

SSH into your server:

```bash
ssh root@your-server-ip
```

Update the system:

```bash
apt update && apt upgrade -y
```

Create a non-root user (recommended):

```bash
adduser aiblty
usermod -aG sudo aiblty
su - aiblty
```

---

## Step 2: Install Docker & Docker Compose

```bash
# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group (so you don't need sudo)
sudo usermod -aG docker $USER

# Log out and back in, or run:
newgrp docker

# Verify installation
docker --version
docker compose version
```

---

## Step 3: Upload or Clone the Project

Option A - Clone from Git:
```bash
cd ~
git clone https://github.com/your-username/aiblty-backend.git
cd aiblty-backend/backend
```

Option B - Upload via SCP:
```bash
# From your local machine:
scp -r ./backend aiblty@your-server-ip:~/aiblty-backend
```

Then on the server:
```bash
cd ~/aiblty-backend
```

---

## Step 4: Configure Environment Variables

Copy the example env file:

```bash
cp .env.example .env
```

Edit the environment file:

```bash
nano .env
```

**Required values to change:**

```env
# Generate a secure JWT secret (run this command):
# openssl rand -base64 64
JWT_SECRET=paste-your-generated-secret-here

# Your admin email(s) - comma separated
ADMIN_EMAILS=your-email@example.com

# Database password - use a strong password
POSTGRES_PASSWORD=your-secure-db-password

# Your domain
CORS_ORIGINS=https://aiblty.com,https://www.aiblty.com
FRONTEND_URL=https://aiblty.com

# Stripe keys (from dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_PRICE_PRO=price_your_pro_id
STRIPE_PRICE_ELITE=price_your_elite_id

# OpenAI key (from platform.openai.com)
OPENAI_API_KEY=sk-your-openai-key
```

Save and exit (Ctrl+X, Y, Enter).

---

## Step 5: Build and Start Services

```bash
# Build and start all containers
docker compose up -d --build

# Check if containers are running
docker compose ps

# View logs
docker compose logs -f
```

You should see:
- `aiblty-db` - Running (healthy)
- `aiblty-backend` - Running
- `aiblty-nginx` - Running

---

## Step 6: Run Database Migrations

```bash
# Run Prisma migrations
docker compose exec backend npx prisma migrate deploy

# Seed the database (creates admin user)
docker compose exec backend npx prisma db seed
```

**Important:** After seeding, change your admin password immediately via the app.

---

## Step 7: Configure SSL with Certbot (HTTPS)

Install Certbot:

```bash
sudo apt install -y certbot
```

Stop nginx temporarily:

```bash
docker compose stop nginx
```

Get SSL certificate:

```bash
sudo certbot certonly --standalone -d api.aiblty.com
```

Copy certificates to the project:

```bash
sudo mkdir -p ~/aiblty-backend/ssl
sudo cp /etc/letsencrypt/live/api.aiblty.com/fullchain.pem ~/aiblty-backend/ssl/
sudo cp /etc/letsencrypt/live/api.aiblty.com/privkey.pem ~/aiblty-backend/ssl/
sudo chown -R $USER:$USER ~/aiblty-backend/ssl
```

Update nginx.conf to enable SSL (uncomment the SSL lines):

```bash
nano nginx.conf
```

Uncomment these sections:
- `listen 443 ssl http2;`
- All `ssl_*` directives
- The HTTP->HTTPS redirect server block

Restart nginx:

```bash
docker compose up -d nginx
```

Set up auto-renewal:

```bash
sudo crontab -e
# Add this line:
0 0 1 * * certbot renew --quiet && cp /etc/letsencrypt/live/api.aiblty.com/*.pem /home/aiblty/aiblty-backend/ssl/ && docker compose -f /home/aiblty/aiblty-backend/docker-compose.yml restart nginx
```

---

## Step 8: Configure Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://api.aiblty.com/api/billing/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the signing secret to your `.env` as `STRIPE_WEBHOOK_SECRET`
5. Restart the backend: `docker compose restart backend`

---

## Step 9: Connect Frontend

In your Lovable frontend, set the API base URL:

1. Create/update `.env` in the frontend:
```
VITE_API_BASE_URL=https://api.aiblty.com/api
```

2. Or if using Lovable, add this as an environment variable in the project settings.

---

## Step 10: Verify Everything Works

Test the API:

```bash
# Health check
curl https://api.aiblty.com/health

# Should return: {"status":"ok","timestamp":"..."}
```

Test authentication:

```bash
# Register (use your admin email from ADMIN_EMAILS)
curl -X POST https://api.aiblty.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your-admin@email.com","password":"SecurePassword123!"}'
```

---

## Maintenance Commands

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend

# Restart all services
docker compose restart

# Stop all services
docker compose down

# Update and rebuild
git pull
docker compose up -d --build

# Access database
docker compose exec db psql -U aiblty -d aiblty

# Run a migration
docker compose exec backend npx prisma migrate deploy

# Backup database
docker compose exec db pg_dump -U aiblty aiblty > backup_$(date +%Y%m%d).sql
```

---

## Troubleshooting

**Container won't start:**
```bash
docker compose logs backend
```

**Database connection error:**
```bash
# Check if db is healthy
docker compose ps
# Recreate
docker compose down -v
docker compose up -d
```

**Permission denied errors:**
```bash
sudo chown -R $USER:$USER ~/aiblty-backend
```

**Port already in use:**
```bash
sudo lsof -i :80
sudo lsof -i :4000
# Kill the process or change ports in docker-compose.yml
```

---

## Security Checklist

- [ ] Changed default database password
- [ ] Generated strong JWT_SECRET
- [ ] Set correct ADMIN_EMAILS
- [ ] Enabled SSL/HTTPS
- [ ] Set up firewall (UFW)
- [ ] Changed admin password after first login
- [ ] Configured Stripe webhook signing secret

---

## Firewall Setup (Optional but Recommended)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

**Your AIBLTY backend is now running!**

Frontend: Deploy via Lovable and point `VITE_API_BASE_URL` to `https://api.aiblty.com/api`
