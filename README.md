# 🚀 Installation & Startup Guide

Get Guardian Dashboard running locally with the following steps:

## 1. Prerequisites

- **Node.js** (v16 or higher): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **git**: [Git install instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)  
  _Check if Git is installed:_
  ```sh
  git --version
  ```

## 2. Clone the Repository

Open your terminal and run:
```sh
git clone https://github.com/Guardians-Stuff/Dashboard.git
```

## 3. Go to the Project Directory

```sh
cd Dashboard
```

## 4. Install Dependencies

```sh
npm install
```

## 5. Set Up Environment Variables

Copy the example environment file:
```sh
cp .env.example .env.local
```
Edit `.env.local` as needed (add your MongoDB URI and any other required secrets).

## 6. Start the Development Server

```sh
npm run dev
```
This launches the dashboard at http://localhost:3000 by default.

---

You’re all set!  
Visit [http://localhost:3000](http://localhost:3000) in your browser to use Guardian Dashboard.

For production or further deployment, check additional instructions in this README. (soon)
