import { mockPackages } from '../data/packages';
import { EventPackage } from '../types';
import { delay } from './apiHelper';

export const packageService = {
  async getPackages(): Promise<EventPackage[]> {
    await delay(300);
    return [...mockPackages];
  },
};
