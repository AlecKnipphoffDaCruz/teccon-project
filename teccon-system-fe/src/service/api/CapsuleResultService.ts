import URL from "../../utils/URL.ts";
import axios, { AxiosError } from "axios";
import type { ApiResponse } from "../../utils/ApiResponse.ts";
import type { CapsuleResult } from "../../interfaces/CapsuleResult.ts";
import type { CapsuleResultRequestPayload } from "../../interfaces/CapsuleResultRequestPayload.ts";

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

export async function createCapsuleResult(
    payload: CapsuleResultRequestPayload
): Promise<ApiResponse<CapsuleResult>> {
    try {
        const response = await axios.post<CapsuleResult>(
            `${URL}/capsule-results`,
            payload
        );

        return {
            success: true,
            message: "Resultado da cápsula criado com sucesso",
            data: response.data,
        };
    } catch (error) {
        return handleError(error, "Erro ao criar resultado da cápsula");
    }
}

export async function getCapsuleResults(): Promise<
    ApiResponse<CapsuleResult[]>
> {
    try {
        const response = await axios.get<CapsuleResult[]>(
            `${URL}/capsule-results`
        );

        return {
            success: true,
            message: "Resultados buscados com sucesso",
            data: response.data,
        };
    } catch (error) {
        return handleError(error, "Erro ao buscar resultados");
    }
}

export async function getCapsuleResultById(
    id: string
): Promise<ApiResponse<CapsuleResult>> {
    try {
        const response = await axios.get<CapsuleResult>(
            `${URL}/capsule-results/${id}`
        );

        return {
            success: true,
            message: "Resultado buscado com sucesso",
            data: response.data,
        };
    } catch (error) {
        return handleError(error, "Erro ao buscar resultado");
    }
}

export async function updateCapsuleResult(
    id: string,
    payload: CapsuleResultRequestPayload
): Promise<ApiResponse<CapsuleResult>> {
    try {
        const response = await axios.put<CapsuleResult>(
            `${URL}/capsule-results/${id}`,
            payload
        );

        return {
            success: true,
            message: "Resultado atualizado com sucesso",
            data: response.data,
        };
    } catch (error) {
        return handleError(error, "Erro ao atualizar resultado");
    }
}

export async function deleteCapsuleResult(
    id: string
): Promise<ApiResponse<null>> {
    try {
        await axios.delete(`${URL}/capsule-results/${id}`);

        return {
            success: true,
            message: "Resultado deletado com sucesso",
            data: null,
        };
    } catch (error) {
        return handleError(error, "Erro ao deletar resultado");
    }
}