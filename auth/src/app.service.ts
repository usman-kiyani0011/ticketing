import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async signup(payload: any) {
    const { email } = payload;
    try {
      const findEmail = await this.userModel.findOne({ email });
      if (findEmail) {
        throw new ConflictException('Email already exists');
      }
      const hashedPassword = await bcrypt.hash(payload?.password, 10);
      const user = await this.userModel.create({
        ...payload,
        password: hashedPassword,
      });
      const { password, ...restObject } = user.toJSON();
      return restObject;
    } catch (error) {
      throw error;
    }
  }
  async signin(payload: any) {
    const { email, password } = payload;
    try {
      const user = await this.validateUser(email, password);
      if (!user) throw new UnauthorizedException('Invalid Credentials');
      const payload = { email: user?.email, sub: user?._id };

      return {
        user: user,
        accessToken: this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET,
        }),
      };
    } catch (error) {
      throw error;
    }
  }
  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({ email: username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...restObject } = user;
      return restObject;
    }
    return null;
  }
  async changePassword(payload: any) {
    try {
      const { password, newPassword, userId } = payload;
      const user = await this.userModel.findOne({ _id: userId });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new BadRequestException(`Invalid password`);
      const updatedHash = await bcrypt.hash(newPassword, 10);
      await this.updateUser(userId, {
        password: updatedHash,
      });
      return '';
    } catch (error) {
      throw error;
    }
  }
  async verifyToken({ token }) {
    try {
      const verifiedPayload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if (!verifiedPayload || !verifiedPayload?.sub) {
        throw new UnauthorizedException('Invalid Token');
      }
      const user = await this.userModel.findOne({
        email: verifiedPayload?.email,
      });
      const { password, ...restObject } = user;
      return restObject;
    } catch (err) {
      throw new err();
    }
  }

  async create(payload) {
    try {
      return await this.userModel.create(payload);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, payload: any) {
    try {
      return this.userModel.findByIdAndUpdate({ _id: id }, { $set: payload });
    } catch (error) {
      throw error;
    }
  }
}
