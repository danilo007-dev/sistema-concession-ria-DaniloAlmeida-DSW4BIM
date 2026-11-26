const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";
const TOKEN_KEY = "autoviva_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const saveToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try { response = await fetch(`${API_URL}${path}`, { ...options, headers }); }
  catch { throw new Error("Não foi possível conectar à API. Verifique se o servidor está ativo."); }
  if (response.status === 401 && path !== "/auth/login" && path !== "/auth/register") {
    clearToken();
    window.dispatchEvent(new Event("autoviva:session-expired"));
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `Falha na requisição (${response.status}).`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
