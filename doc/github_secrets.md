# Using GitHub Secrets to Populate `process.env`

1. **Create a GitHub Secret**:
   - Go to your GitHub account.
   - Navigate to the repository settings.
   - Click on "Secrets" in the left sidebar.
   - Click on "New repository secret".
   - Enter a name for the secret (e.g., `GITHUB_TOKEN`).
   - Click on "Create secret".

2. **Add the Secret to Your Repository**:
   - Go to your repository on GitHub.
   - Click on "Settings" in the top right corner.
   - Click on "Secrets" in the left sidebar.
   - Click on "Actions" and then "New repository secret".
   - Select your newly created secret from the dropdown.
   - Click on "Add secret".

3. **Use the Secret in Your Project**:
   - In your project, create a `.env` file if it doesn't already exist.
   - Add the following line to the `.env` file:
     ```bash
     GITHUB_TOKEN=your_github_token
