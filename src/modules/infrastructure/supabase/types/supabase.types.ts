import { Provider, Type } from '@nestjs/common';

export interface SupabaseModuleOptions {
  supabaseUrl: string;
  supabaseKey: string;
  supabaseBucketName: string;
  supabaseJwtSecret: string;
}

export interface SupabaseOptionsFactory {
  createSupabaseOptions(): Promise<SupabaseModuleOptions> | SupabaseModuleOptions;
}

export interface SupabaseModuleAsyncOptions {
  global?: boolean;
  imports?: any[];
  useExisting?: Type<SupabaseOptionsFactory>;
  useClass?: Type<SupabaseOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<SupabaseModuleOptions> | SupabaseModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}

export enum SupabaseRole {
  Anon = 'anon',
  Authenticated = 'authenticated',
}
