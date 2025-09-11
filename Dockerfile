FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
	gcc \
	libpq-dev \
	curl \
	&& rm -rf /var/lib/apt/lists/*

# Install poetry
RUN pip install --no-cache-dir poetry

# Copy poetry file(s)
COPY pyproject.toml ./

# Install dependencies
RUN poetry config virtualenvs.create false && \
	poetry install --no-dev --no-interaction --no-ansi

# Copy the rest of the application code
COPY . /app

# Create non-root user
RUN useradd --create-home --shell /bin/bash app && \
	chown -R app:app /app
USER app

# Expose port
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
	CMD curl -fsS http://localhost:8080/healthz || exit 1

# Command to run the application
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
