import { User, UserSchema } from './user/user.schema';

export const ModelsProvider = [
  {
    name: User.name,
    schema: UserSchema,
  },
];
