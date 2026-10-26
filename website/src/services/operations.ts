import { mockIncidents } from '../data/operations';
import { OperationsIncident } from '../types';
import { delay } from './apiHelper';

let workingIncidents: OperationsIncident[] = [...mockIncidents];

export const operationsService = {
  async getIncidents(): Promise<OperationsIncident[]> {
    await delay(350);
    return [...workingIncidents];
  },

  async updateIncidentStatus(
    id: string,
    status: 'open' | 'investigating' | 'resolved',
    resolutionNotes?: string
  ): Promise<OperationsIncident> {
    await delay(400);
    const index = workingIncidents.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Incident not found');

    workingIncidents[index] = {
      ...workingIncidents[index],
      status,
      resolutionNotes: resolutionNotes || workingIncidents[index].resolutionNotes,
    };
    return { ...workingIncidents[index] };
  },
};
