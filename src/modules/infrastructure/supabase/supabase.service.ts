import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as tus from 'tus-js-client';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/core/enums/app.enums';
import { AuthException } from 'src/core/exceptions/auth.exception';
import { JwtService } from '@nestjs/jwt';
import {
  SupabaseModuleOptions,
  SupabaseRole,
} from 'src/modules/infrastructure/supabase/types/supabase.types';
import { LoggerService } from 'src/modules/infrastructure/logger/logger.service';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  private readonly supabaseBucketName: string;

  constructor(
    options: SupabaseModuleOptions,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
  ) {
    const { supabaseUrl, supabaseKey, supabaseBucketName, supabaseJwtSecret } = options;
    this.supabaseBucketName = supabaseBucketName;
    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });

    const supabaseAccessToken = this.jwtService.sign(
      { iat: Date.now(), role: SupabaseRole.Authenticated },
      {
        secret: supabaseJwtSecret,
        expiresIn: '36500d',
      },
    );

    this.supabase.realtime.setAuth(supabaseAccessToken);
  }

  public async upload(file: Express.Multer.File, filename?: string): Promise<any> {
    const { accessTokenValue: accessToken } = await this.supabase.realtime;

    if (!accessToken) {
      throw new AuthException(
        'Cannot upload the file. Access token for supabase storage is missing',
      );
    }

    return new Promise((resolve, reject) => {
      const upload = new tus.Upload(Buffer.from(file.buffer) as any, {
        endpoint: `${this.configService.get<string>(ConfigVariables.SupabaseUrl)}/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${accessToken}`,
          apikey: this.configService.get<string>(ConfigVariables.SupabaseKey) || '',
          'x-upsert': 'true',
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: this.supabaseBucketName,
          objectName: filename || file.originalname,
          contentType: file.mimetype,
        },
        chunkSize: 6 * 1024 * 1024,
        onSuccess: () =>
          resolve({
            file: { ...file, filename: filename || file.originalname },
            buffer: upload.file,
          }),
        onError: (error: any) => reject(error),
        onProgress: (bytesUploaded: number, bytesTotal: number) => {
          const _ = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        },
      });

      return upload
        .findPreviousUploads()
        .then(previousUploads => {
          if (previousUploads.length) {
            upload.resumeFromPreviousUpload(previousUploads[0]);
          }

          upload.start();
        })
        .catch(error => {
          this.loggerService.error(error.message, error, SupabaseService.name);
        });
    });
  }

  public async remove(paths: string[]): Promise<any> {
    return this.supabase.storage.from(this.supabaseBucketName).remove(paths);
  }
}
