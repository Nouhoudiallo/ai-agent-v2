// Extension de l'interface Request pour inclure le champ 'file' de Multer
import type { Request } from 'express';
import type { File as MulterFile } from 'multer';

declare module 'express-serve-static-core' {
  interface Request {
    file?: MulterFile;
  }
}
