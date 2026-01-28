import { apiClient } from '@/lib/api/axios.config';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import type {
  Location,
  LocationsResponse,
  LocationFilters,
  CreateLocationInput,
  UpdateLocationInput,
} from '../types/location.types';

interface GetLocationsParams extends LocationFilters {
  page?: number;
  limit?: number;
}

class LocationService {
  async getLocations(params: GetLocationsParams = {}) {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: LocationsResponse;
    }>(API_ENDPOINTS.LOCATIONS.LIST, { params });

    return response.data.data;
  }

  async getLocation(id: string) {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: Location;
    }>(API_ENDPOINTS.LOCATIONS.GET(id));

    return response.data.data;
  }

  async createLocation(data: CreateLocationInput) {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: Location;
    }>(API_ENDPOINTS.LOCATIONS.CREATE, data);

    return response.data.data;
  }

  async updateLocation(id: string, data: UpdateLocationInput) {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
      data: Location;
    }>(API_ENDPOINTS.LOCATIONS.UPDATE(id), data);

    return response.data.data;
  }

  async deleteLocation(id: string) {
    await apiClient.delete(API_ENDPOINTS.LOCATIONS.DELETE(id));
  }
}

export const locationService = new LocationService();
