FROM node:24

WORKDIR /app

# ติดตั้ง pnpm
RUN npm install -g pnpm

# copy workspace manifest files ก่อน (เพื่อ cache layer)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY client/package.json ./client/
COPY component/package.json ./component/

# install dependencies (workspace-aware)
RUN pnpm install --frozen-lockfile

# copy code
COPY . .
