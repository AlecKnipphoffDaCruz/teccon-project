import axios from "axios";
import URL from "../../utils/URL.ts";

const urlAuth = `${URL}/auth`;


export async function login(object: { user: string, password: string }) {
    const response = await axios.post(urlAuth + "/login", object);
    if (response.status !== 200) {
        return "Error ao fazer login";
    } else {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
}

export async function logout() {
    localStorage.removeItem("token");
}