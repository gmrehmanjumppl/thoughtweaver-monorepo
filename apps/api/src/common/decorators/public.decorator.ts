import { SetMetadata } from '@nestjs/common';

/**
 * Public decorator - marks route as public (skips JWT authentication)
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

