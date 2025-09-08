import { SetMetadata } from '@nestjs/common';

// make route bypass APP_GUARD or any guard(need to code in that guard)
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
