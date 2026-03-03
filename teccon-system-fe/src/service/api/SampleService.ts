import URL from "../../utils/URL";
import axios from "axios";
import type { ApiResponse } from "../../utils/ApiResponse";
import type { Sample } from "../../interfaces/Sample";
import type { CreateSamplePayload } from "../../interfaces/CreateSamplePayload";

/**
 * Criar amostra
 */
export async function createSample(
  samples: CreateSamplePayload[]
): Promise<ApiResponse<Sample[]>> {
  try {
    const response = await axios.post(`${URL}/samples`, samples);

    return {
      success: true,
      message: "Amostras criadas com sucesso",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ?? "Erro ao criar amostras",
    };
  }
}

/**
 * Buscar amostras por Collection
 */
export async function getSamplesByCollection(
  collectionId: number
): Promise<ApiResponse<Sample[]>> {
  try {
    const response = await axios.get(
      `${URL}/samples/collection/${collectionId}`
    );

    return {
      success: true,
      message: "Amostras buscadas com sucesso",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ??
        "Erro ao buscar amostras",
    };
  }
}

/**
 * Buscar amostra por ID
 */
export async function getSampleById(
  id: number
): Promise<ApiResponse<Sample>> {
  try {
    const response = await axios.get(`${URL}/samples/${id}`);

    return {
      success: true,
      message: "Amostra buscada com sucesso",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ??
        "Erro ao buscar amostra",
    };
  }
}

/**
 * Deletar amostra
 */
export async function deleteSample(
  id: number
): Promise<ApiResponse<null>> {
  try {
    await axios.delete(`${URL}/samples/${id}`);

    return {
      success: true,
      message: "Amostra deletada com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ??
        "Erro ao deletar amostra",
    };
  }
}