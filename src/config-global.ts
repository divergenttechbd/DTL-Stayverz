// routes

import { paths } from "./routes/paths";

// API
// ----------------------------------------------------------------------

// export const HOST_API = process.env.REACT_APP_API_BASE_URL;
export const HOST_API = "https://btayverz.divergenttechbd.com/api/v1/"; // Use this for local development
// export const HOST_API = "http://192.168.8.158:8000/api/v1/"; // Use this for local development
// export const HOST_API = "http://192.168.7.26:8000/api/v1/"; // Use this for local development

export const ASSETS_API = process.env.REACT_APP_API_BASE_URL;
// export const ASSETS_API = process.env.REACT_APP_API_BASE_URL;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
