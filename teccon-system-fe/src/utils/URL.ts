const URL = import.meta.env.VITE_BACKEND_URL;

if (!URL) {
  throw new Error("VITE_BACKEND_URL não está definida!");
}

export default URL;