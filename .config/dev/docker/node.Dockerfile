FROM node:24

WORKDIR /app

# ติดตั้ง pnpm
RUN npm install -g pnpm

# copy dependency ก่อน (เพื่อ cache)
COPY package.json pnpm-lock.yaml ./

# install dependencies
RUN pnpm install --frozen-lockfile

# copy code
COPY . .
