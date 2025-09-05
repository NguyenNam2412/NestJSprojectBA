import { plainToInstance } from 'class-transformer';
import { IsInt, IsString, validateSync } from 'class-validator';

// Define a class to validate the environment variables
class EnvironmentVariables {
  @IsInt()
  PORT!: number;

  @IsString()
  DATABASE_HOST!: string;

  @IsInt()
  DATABASE_PORT!: number;

  @IsString()
  DATABASE_USER!: string;

  @IsString()
  DATABASE_PASS!: string;

  @IsString()
  DATABASE_NAME!: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
