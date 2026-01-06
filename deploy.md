# Deployment Guide for MediPort

This guide provides step-by-step instructions on how to download the project files, run the application on your local machine for development, and deploy it to a live production environment using Netlify.

## 1. Downloading the Project

The best way to get the project files is to clone the repository from GitHub. This ensures you have the complete history of the project, which is useful for future development.

First, make sure you have [Git](https://git-scm.com/downloads) installed on your system.

Then, open your terminal, navigate to the directory where you want to store the project, and run the following command. **Remember to replace `your-username/your-repository-name.git` with your actual GitHub repository URL.**

```bash
git clone https://github.com/your-username/your-repository-name.git
```

After the command finishes, navigate into the newly created project directory:

```bash
cd your-repository-name
```

## 2. Running the Project Locally

Once you have the project on your local machine, you need to install its dependencies and start the development server.

### Prerequisites

- **Node.js**: Version 18.0 or later.
- **npm**: Should be included with Node.js.

### Steps

1.  **Install Dependencies**:
    From the root of the project directory, run the following command to install all the required packages listed in `package.json`:
    ```bash
    npm install
    ```

2.  **Set Up Firebase Environment Variables**:
    You will need to connect the project to your Firebase backend.
    - Go to your Firebase project settings.
    - Under "Your apps", find your web app and copy the `firebaseConfig` object.
    - Create a `.env` file in the root of your project if it doesn't exist.
    - The project is set up to automatically configure Firebase for App Hosting, but for local development, you might need to manually configure it in `src/firebase/config.ts`.

3.  **Run the Development Server**:
    Execute the following command to start the Next.js development server:
    ```bash
    npm run dev
    ```
    The application should now be running and accessible at `http://localhost:9002`.

## 3. Deploying with Netlify

Netlify provides a simple and powerful way to deploy modern web projects. It can connect directly to your GitHub repository and automatically deploy your site whenever you push new changes.

### Steps

1.  **Sign up for Netlify**:
    If you don't have one already, create a free account on [Netlify.com](https://www.netlify.com/) using your GitHub account.

2.  **Add a New Site**:
    - From your Netlify dashboard, click the "**Add new site**" button and select "**Import an existing project**".
    - Connect to **GitHub** as your Git provider.
    - Authorize Netlify to access your repositories and choose the repository for this project.

3.  **Configure Build Settings**:
    Netlify will automatically detect that this is a Next.js project and pre-fill most of the settings. You should verify they are correct:
    - **Build command**: `npm run build`
    - **Publish directory**: `.next`

4.  **Add Environment Variables**:
    This is the most critical step for a successful deployment. You need to provide Netlify with your Firebase project credentials so it can connect to your database.
    - In your site's settings on Netlify, go to **Site configuration > Environment variables**.
    - Add the following environment variables, copying the values from your Firebase project's web app configuration (`firebaseConfig`):

      | Variable Name            | Value                                   |
      | ------------------------ | --------------------------------------- |
      | `NEXT_PUBLIC_API_KEY`    | Your Firebase `apiKey`                  |
      | `NEXT_PUBLIC_AUTH_DOMAIN`| Your Firebase `authDomain`              |
      | `NEXT_PUBLIC_PROJECT_ID` | Your Firebase `projectId`               |
      | `NEXT_PUBLIC_STORAGE_BUCKET` | Your Firebase `storageBucket`       |
      | `NEXT_PUBLIC_MESSAGING_SENDER_ID` | Your Firebase `messagingSenderId` |
      | `NEXT_PUBLIC_APP_ID`     | Your Firebase `appId`                   |

    *Note: The `NEXT_PUBLIC_` prefix is essential for Next.js to expose these variables to the client-side code.*

5.  **Deploy Site**:
    Click the "**Deploy site**" button. Netlify will start the build process. Once it's finished, your site will be live on a unique Netlify URL (e.g., `your-site-name.netlify.app`). You can add a custom domain later in the Netlify settings.

Your MediPort application is now deployed!
