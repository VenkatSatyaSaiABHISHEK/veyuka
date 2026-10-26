import { mockEmployees } from '../data/employees';
import { Employee } from '../types';
import { delay } from './apiHelper';

let workingEmployees: Employee[] = [...mockEmployees];

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    await delay(350);
    return [...workingEmployees];
  },

  async updateAttendance(id: string, attendance: 'present' | 'absent' | 'leave'): Promise<Employee> {
    await delay(300);
    const index = workingEmployees.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Employee not found');

    workingEmployees[index] = { ...workingEmployees[index], attendance };
    return { ...workingEmployees[index] };
  },
};
