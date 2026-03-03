import URL from "../../utils/URL";
import axios from "axios";
import type { ApiResponse } from "../../utils/ApiResponse";
import type { Construction } from "../../interfaces/Construction";

const BASE_URL = `${URL}/constructions`;

export async function createConstruction(
  construction: Construction
): Promise<ApiResponse<Construction>> {
  try {
    const response = await axios.post(BASE_URL, construction);
    return {
      success: true,
      message: "Construção criada com sucesso",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao criar construção",
    };
  }
}

export async function getConstructions(): Promise<ApiResponse<Construction[]>> {
  try {
    const response = await axios.get(BASE_URL);
    return {
      success: true,
      message: "Construções buscadas com sucesso",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao buscar construções",
    };
  }
}

export async function getConstructionById(
  id: string
): Promise<ApiResponse<Construction>> {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return {
      success: true,
      message: "Construção buscada com sucesso",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao buscar construção",
    };
  }
}

export async function updateConstruction(
    id: string,
    construction: Construction
): Promise<ApiResponse<Construction>> {
    try {
        const payload = {
            name: construction.name,
            curingAgesExpected: construction.curingAgesExpected,
            quantityExpected: construction.quantityExpected,
            obs: construction.obs,
        };
        const response = await axios.put(`${BASE_URL}/${id}`, payload);
        return { success: true, message: "Construção atualizada com sucesso", data: response.data };
    } catch (error) {
        return { success: false, message: "Erro ao atualizar construção" };
    }
}

export async function deleteConstruction(
  id: string
): Promise<ApiResponse<null>> {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return {
      success: true,
      message: "Construção deletada com sucesso",
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao deletar construção",
    };
  }
}