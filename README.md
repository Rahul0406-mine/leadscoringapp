# Leadscoring Frontend

This is the frontend for the leadscoring application.

## Development Setup

1.  **Node Version:** Make sure you have the correct Node.js version installed. You can use a tool like `nvm` to manage Node versions. To use the version specified in this project, run:
    ```bash
    nvm use
    ```

2.  **Install Dependencies:** Install the necessary npm packages:
    ```bash
    npm ci
    ```

3.  **Environment Variables:** Create a `.env` file in the root of the `frontend` directory and add the following environment variables:
    ```
    VITE_API_BASE=http://localhost:8000
    ```

4.  **Run the Development Server:** Start the Vite development server:
    ```bash
    npm run dev
    ```

## Available Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the code using ESLint.
*   `npm run format`: Formats the code with Prettier.
*   `npm run preview`: Previews the production build locally.
