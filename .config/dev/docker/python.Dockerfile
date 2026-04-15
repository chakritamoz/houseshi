FROM python:3.14-bookworm

# ป้องกัน pyc + buffer
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# install uv
RUN pip install uv

# copy dependency ก่อน (เพื่อ cache)
COPY pyproject.toml uv.lock ./

# install dependencies
RUN uv sync --frozen

# copy code
COPY . .