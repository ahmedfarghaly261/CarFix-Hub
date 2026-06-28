import { User, IUser } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';

export class AuthService {
  static async register(data: any): Promise<IUser> {
    const userExists = await User.findOne({ email: data.email });
    if (userExists) {
      throw new ApiError(400, 'User already exists');
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'user',
    });

    return user;
  }

  static async login(data: any): Promise<IUser> {
    const user = await User.findOne({ email: data.email });
    if (!user || !(await user.matchPassword(data.password))) {
      throw new ApiError(401, 'Invalid email or password');
    }

    return user;
  }
}
