import { OnlyRequired } from '../helpers/OnlyRequired.js';
import { UserDto } from '../models/user/UserDto.js';

export type UserModifiesUserDataRequest = OnlyRequired<UserDto, 'id'>;


