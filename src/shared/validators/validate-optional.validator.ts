import { ValidateIf } from 'class-validator';

/** validate optional parameter (if any) */
export function ValidateOptional() {
  return ValidateIf((o, v) => v != undefined);
}
