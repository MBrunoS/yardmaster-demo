export interface Parcel {
  readonly weightGrams: number;
  readonly quantity: number;
}

/** Total shipping weight in kilograms, to three decimals. */
export function totalWeightKg(parcels: readonly Parcel[]): number {
  const grams = parcels.reduce((sum, parcel) => sum + parcel.weightGrams * parcel.quantity, 0);
  return Math.round(grams) / 1000;
}
