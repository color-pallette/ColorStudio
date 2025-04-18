import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function hexColorValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    // Regular expression to match valid hex color codes
    // Matches both 3-digit and 6-digit hex codes with optional #
    const hexColorRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    if (!hexColorRegex.test(control.value)) {
      return { invalidHexColor: true };
    }

    return null;
  };
} 