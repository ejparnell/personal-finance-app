import { fetchWrapper } from '@/lib/utils';
import { PotInput, potSchema } from '@/schemas/pot';
import { PotType } from '@/types/pot';
import { ApiResponse } from '@/types/api';

export async function createPot(
    potData: PotInput
): Promise<ApiResponse<PotType>> {
    const validatedData = potSchema.parse(potData);
    if (!validatedData) {
        throw new Error('Invalid pot data');
    }

    const response = await fetchWrapper<PotType>('/api/pots', {
        method: 'POST',
        body: JSON.stringify(validatedData),
    });

    return response;
}

export async function getPots(): Promise<ApiResponse<PotType[]>> {
    const response = await fetchWrapper<PotType[]>('/api/pots', {
        method: 'GET',
    });

    return response;
}

export async function editPot(
    potId: string,
    potData: PotInput
): Promise<ApiResponse<PotType>> {
    const validatedData = potSchema.parse(potData);
    if (!validatedData) {
        throw new Error('Invalid pot data');
    }

    const response = await fetchWrapper<PotType>(`/api/pots/${potId}`, {
        method: 'PATCH',
        body: JSON.stringify(validatedData),
    });

    return response;
}

export async function deletePot(potId: string): Promise<ApiResponse<null>> {
    const response = await fetchWrapper<null>(`/api/pots/${potId}`, {
        method: 'DELETE',
    });

    return response;
}
