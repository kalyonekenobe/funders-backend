import { Decimal } from '@prisma/client/runtime/library';

export const configurePrismaDecimalJSONStringifyOutput = (precision: number = 9) => {
  (Decimal.prototype as any).toJSON = function () {
    return parseFloat(Number(this.toString()).toFixed(precision));
  };
};