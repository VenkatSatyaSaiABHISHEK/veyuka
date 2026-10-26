import { mockUpdates } from '../data/updates';
import { mockTestimonials } from '../data/testimonials';
import { UpdateCard, Testimonial } from '../types';
import { delay } from './apiHelper';

export const updateService = {
  async getUpdates(): Promise<UpdateCard[]> {
    return delay(mockUpdates, 350);
  },

  async getTestimonials(): Promise<Testimonial[]> {
    return delay(mockTestimonials, 350);
  },
};
