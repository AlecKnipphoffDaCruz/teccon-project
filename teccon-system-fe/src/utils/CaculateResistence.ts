export function calculateResistanceMPa(cargaTotalKgF: number): number {
    const AREA_CM2 = 78.54; // corpo 10x20
    const CONVERSION = 10.1972; // kgf/cm² para MPa

    const resistencia = (cargaTotalKgF / AREA_CM2) / CONVERSION;

    return Number(resistencia.toFixed(2));
}