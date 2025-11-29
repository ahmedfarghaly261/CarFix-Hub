Frontend - CarFix

Local dev setup

1. Copy the environment file if you need to customize it:

```
cd frontend
cp .env .env.local
```

2. By default the frontend points to `http://localhost:5000/api`. To change it, edit `.env` and set `VITE_API_URL`.

3. Install and start the frontend (Vite):

```
npm install
npm run dev
```

Notes: The backend should have `FRONTEND_URL` set to `http://localhost:5173` (Vite default) so CORS and cookies work during development.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
