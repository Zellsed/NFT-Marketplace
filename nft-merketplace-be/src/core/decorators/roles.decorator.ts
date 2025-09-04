import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../common/enum';

export const Role = (...roles: Roles[]) => SetMetadata('roles', roles);
