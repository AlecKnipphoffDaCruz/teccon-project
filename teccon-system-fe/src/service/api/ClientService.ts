import URL from "../../utils/URL";
import axios from "axios";
import type { ApiResponse } from "../../utils/ApiResponse";
import type { Client } from "../../interfaces/Client";
import type { ClientRequest } from "../../interfaces/ClientRequest";

/**
 * Criar cliente
 */
export async function createClient(
    client: ClientRequest
): Promise<ApiResponse<Client>> {
    try {
        const response = await axios.post(`${URL}/clients`, client);

        return {
            success: true,
            message: "Cliente criado com sucesso",
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response?.data?.message ?? "Erro ao criar cliente",
        };
    }
}

/**
 * Buscar todos os clientes
 */
export async function getClients(): Promise<ApiResponse<Client[]>> {
    try {
        const response = await axios.get(`${URL}/clients`);

        return {
            success: true,
            message: "Clientes buscados com sucesso",
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response?.data?.message ?? "Erro ao buscar clientes",
        };
    }
}

/**
 * Buscar cliente por ID
 */
export async function getClientById(
    id: number
): Promise<ApiResponse<Client>> {
    try {
        const response = await axios.get(`${URL}/clients/${id}`);

        return {
            success: true,
            message: "Cliente buscado com sucesso",
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response?.data?.message ?? "Erro ao buscar cliente",
        };
    }
}

/**
 * Atualizar cliente
 */
export async function updateClient(
    id: number,
    client: ClientRequest
): Promise<ApiResponse<Client>> {
    try {
        const response = await axios.put(`${URL}/clients/${id}`, client);

        return {
            success: true,
            message: "Cliente atualizado com sucesso",
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response?.data?.message ?? "Erro ao atualizar cliente",
        };
    }
}

/**
 * Deletar cliente
 */
export async function deleteClient(
    id: number
): Promise<ApiResponse<null>> {
    try {
        await axios.delete(`${URL}/clients/${id}`);

        return {
            success: true,
            message: "Cliente deletado com sucesso",
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response?.data?.message ?? "Erro ao deletar cliente",
        };
    }
}