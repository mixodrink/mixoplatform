import Service from "models/service.model";
import { IService } from "interfaces/service.interface";

/**
 * Creates a new service entry in the database.
 * @param serviceData - The service details from the request.
 * @returns The saved service document.
 */
export const createServiceDB = async (serviceData: IService) => {
  try {
    const newService = new Service(serviceData);
    return await newService.save();
  } catch (error: any) {
    throw new Error(`Error creating service: ${error.message}`);
  }
};
