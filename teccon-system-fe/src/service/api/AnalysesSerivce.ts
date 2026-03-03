import URL from "../../utils/URL.ts";
import axios from "axios";
import type { ApiResponse } from "../../utils/ApiResponse.ts";
import type { CapsuleResult } from "../../interfaces/CapsuleResult.ts";

export async function createAnalysis(capsuleResult: CapsuleResult): Promise<ApiResponse<CapsuleResult>> {
    try {
        const response = await axios.post(`${URL}/analyses`, capsuleResult);
        return {
            success: true,
            message: "Análise criada com sucesso",
            data: response.data,
        };
    }
    catch (error) {
        return {
            success: false,
            message: "Erro ao criar análise",
        };
    }
}

export async function getAnalyses(): Promise<ApiResponse<CapsuleResult[]>> {
    try {
        const response = await axios.get(`${URL}/analyses`);
        return {
            success: true,
            message: "Análises buscadas com sucesso",
            data: response.data,
        };
    }
    catch (error) {
        return {
            success: false,
            message: "Erro ao buscar análises",
        };
    }
}

export async function updateAnalysis(id: string, capsuleResult: CapsuleResult): Promise<ApiResponse<CapsuleResult>> {
    try {
        const response = await axios.put(`${URL}/analyses/${id}`, capsuleResult);
        return {
            success: true,
            message: "Análise atualizada com sucesso",
            data: response.data,
        };
    }
    catch (error) {
        return {
            success: false,
            message: "Erro ao atualizar análise",
        };
    }
}

export async function deleteAnalysis(id: string): Promise<ApiResponse<null>> {
    try {
        await axios.delete(`${URL}/analyses/${id}`);
        return {
            success: true,
            message: "Análise deletada com sucesso",
        };
    }
    catch (error) {
        return {
            success: false,
            message: "Erro ao deletar análise",
        };
    }
}

export async function getAnalysisById(id: string): Promise<ApiResponse<CapsuleResult>> {
    try {
        const response = await axios.get(`${URL}/analyses/${id}`);
        return {
            success: true,
            message: "Análise buscada com sucesso",
            data: response.data,
        };
    }
    catch (error) {
        return {
            success: false,
            message: "Erro ao buscar análise",
        };
    }
}