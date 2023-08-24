import { z } from 'zod';

const create = z.object({
  body: z.object({
    roomNumber: z.string({
      required_error: 'Title is required!',
    }),
    floor: z.string({
      required_error: 'Floor is required!',
    }),
    buildingId: z.string({
      required_error: 'Building ID is required!',
    }),
  }),
});

export const RoomValidation = {
  create,
};
