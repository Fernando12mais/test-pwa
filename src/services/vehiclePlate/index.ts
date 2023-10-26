import { useFetchServiceAPI } from '../api';
import { ProcessedVehiclePlateResponse, VehiclePlateResponse } from './types';

export const vehiclePlateService = () => {
  const vehiclePlate = ref<ProcessedVehiclePlateResponse>();
  const isFetchingVehiclePlate = ref(false);

  const getVehiclePlate = async (plate: string) => {
    const { get } = useFetchServiceAPI(`placaVeiculo/${plate}`, {
      onFetchError: ctx => {
        isFetchingVehiclePlate.value = false;
        return ctx;
      },
      beforeFetch: ctx => {
        isFetchingVehiclePlate.value = true;
        return ctx;
      },
      afterFetch: ctx => {
        const data = ctx.data as VehiclePlateResponse;
        const processedData: ProcessedVehiclePlateResponse = {
          brand: data.dsMarca,
          chassis: data.dsChassi,
          color: data.dsCor,
          cylinderCapacity: data.nrCilindrada,
          engine: data.dsMotor,
          fuel: data.dsCombustível,
          generic: data.flGenérico,
          imported: data.flImportado,
          modelYear: data.nrAnoModelo,
          year: data.nrAno,
          power: data.nrPotencia,
          seats: data.nrPassageiros,
          state: data.dsUf,
          model: data.dsModelo,
        };
        vehiclePlate.value = processedData;

        isFetchingVehiclePlate.value = false;
        return ctx;
      },
    });
    await get()
      ?.json()
      .execute(true)
      .then(() => {
        if (!vehiclePlate.value?.brand || !vehiclePlate.value?.modelYear) {
          window.open(`https://placafipe.com/placa/${plate}`, '_blank');
        }
      })
      .catch(err => {
        window.open(`https://placafipe.com/placa/${plate}`, '_blank');
      });
  };

  return { getVehiclePlate, vehiclePlate, isFetchingVehiclePlate };
};
