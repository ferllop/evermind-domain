import { UserDto } from '../domain/user/UserDto.js';
import { OnlyRequired } from '../domain/value/OnlyRequired.js';

export type UserModifiesUserDataRequest = OnlyRequired<UserDto, 'id'>;


