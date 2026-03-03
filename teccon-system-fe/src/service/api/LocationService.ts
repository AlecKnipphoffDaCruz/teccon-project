import URL from "../../utils/URL";
import axios from "axios";
import type { ApiResponse } from "../../utils/ApiResponse";
import type { LocationDTO } from "../../interfaces/LocationDTO";

const BASE_URL = `${URL}/location`;

export async function createLocation(
  location: LocationDTO
): Promise<ApiResponse<Location>> {
  try {
    const response = await axios.post(BASE_URL, location);
    return {
      success: true,
      message: "Local criado com sucesso",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao criar local",
    };
  }
}

export async function getLocations(): Promise<ApiResponse<Location[]>> {
  try {
    const response = await axios.get(BASE_URL);
    return {
      success: true,
      message: "Locais buscados com sucesso",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao buscar locais",
    };
  }
}

export async function getLocationById(
  id: string
): Promise<ApiResponse<Location>> {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return {
      success: true,
      message: "Local buscado com sucesso",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao buscar local",
    };
  }
}

export async function updateLocation(
  id: string,
  location: Location
): Promise<ApiResponse<Location>> {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, location);
    return {
      success: true,
      message: "Local atualizado com sucesso",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao atualizar local",
    };
  }
}

export async function deleteLocation(
  id: string
): Promise<ApiResponse<null>> {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return {
      success: true,
      message: "Local deletado com sucesso",
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao deletar local",
    };
  }
}