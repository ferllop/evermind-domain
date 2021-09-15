import { UserDto } from '../models/user/UserDto.js';
import { OnlyRequired } from '../models/value/OnlyRequired.js';

export type UserModifiesUserDataRequest = OnlyRequired<UserDto, 'id'>;


