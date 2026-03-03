import URL from "../../utils/URL.ts";
import axios from "axios";
import type { ApiResponse } from "../../utils/ApiResponse.ts";
import type { User } from "../../interfaces/User.ts";

export async function createUser(user: User): Promise<ApiResponse<User>> {
    try {
        const response = await axios.post(`${URL}/users`, user);
        return {
            success: true,
            message: "Usuário criado com sucesso",
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: "Erro ao criar usuário",
        };
    }
}
export async function getUsers(): Promise<ApiResponse<User[]>> {
    try {
        const response = await axios.get(`${URL}/users`);
        return {
            success: true,
            message: "Usuários buscados com sucesso",
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: "Erro ao buscar usuários",
        };
    }
}

export async function updateUser(id: string, user: User): Promise<ApiResponse<User>> {
    try {
        const response = await axios.put(`${URL}/users/${id}`, user);
        return {
            success: true,
            message: "Usuário atualizado com sucesso",
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: "Erro ao atualizar usuário",
        };
    }
}
export async function deleteUser(id: string): Promise<ApiResponse<null>> {
    try {
        await axios.put(`${URL}/users/${id}`);
        return {
            success: true,
            message: "Usuário deletado com sucesso",
        };
    } catch (error) {
        return {
            success: false,
            message: "Erro ao deletar usuário",
        };
    }
}
export async function getUserById(id: string): Promise<ApiResponse<User>> {
    try {
        const response = await axios.get(`${URL}/users/${id}`);
        return {
            success: true,
            message: "Usuário buscado com sucesso",
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: "Erro ao buscar usuário",
        };
    }
}
export async function ReActivateUser(id: string): Promise<ApiResponse<User>> {
    try {
        const response = await axios.put(`${URL}/users/reactivate/${id}`);
        return {
            success: true,
            message: "Usuário reativado com sucesso",
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: "Erro ao reativar usuário",
        };
    }
}