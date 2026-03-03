import URL from "../../utils/URL.ts";
import axios, { AxiosError } from "axios";
import type { ApiResponse } from "../../utils/ApiResponse.ts";
import type { Collection } from "../../interfaces/Collection.ts";
import type { CollectionRequestPayload } from "../../interfaces/CollectionRequestPayload.ts";

function handleError(error: unknown, defaultMessage: string): ApiResponse<any> {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        return {
            success: false,
            message: axiosError.response?.data?.message || defaultMessage,
        };
    }

    return {
        success: false,
        message: defaultMessage,
    };
}

export async function createCollection(
    payload: CollectionRequestPayload
): Promise<ApiResponse<Collection>> {
    try {
        const response = await axios.post<Collection>(`${URL}/collections`, payload);

        return {
            success: true,
            message: "Coleta criada com sucesso",
            data: response.data,
        };
    } catch (error) {
        return handleError(error, "Erro ao criar coleta");
    }
}

export async function getCollections(): Promise<ApiResponse<Collection[]>> {
    try {
        const response = await axios.get<Collection[]>(`${URL}/collections`);

        return {
            success: true,
            message: "Coletas buscadas com sucesso",
            data: response.data,
        };
    } catch (error) {
        return handleError(error, "Erro ao buscar coletas");
    }
}

export async function getCollectionById(
    id: string
): Promise<ApiResponse<Collection>> {
    try {
        const response = await axios.get<Collection>(`${URL}/collections/${id}`);

        return {
            success: true,
            message: "Coleta buscada com sucesso",
            data: response.data,
        };
    } catch (error) {
        return handleError(error, "Erro ao buscar coleta");
    }
}

export async function updateCollection(
    id: string,
    payload: CollectionRequestPayload
): Promise<ApiResponse<Collection>> {
    try {
        const response = await axios.put<Collection>(
            `${URL}/collections/${id}`,
            payload
        );

        return {
            success: true,
            message: "Coleta atualizada com sucesso",
            data: response.data,
        };
    } catch (error) {
        return handleError(error, "Erro ao atualizar coleta");
    }
}

export async function deleteCollection(
    id: string
): Promise<ApiResponse<null>> {
    try {
        await axios.delete(`${URL}/collections/${id}`);

        return {
            success: true,
            message: "Coleta deletada com sucesso",
            data: null,
        };
    } catch (error) {
        return handleError(error, "Erro ao deletar coleta");
    }
}