import measurements from '@/utils/measurements';

describe('measurements.mapMeasurementKind', () => {
    it.each([
        ['cup', 'cups'],
        ['tablespoons', 'Tbsp'],
        ['tablespoon', 'Tbsp'],
        ['teaspoons', 'tsp'],
        ['teaspoon', 'tsp'],
        ['ounces', 'oz'],
        ['pounds', 'lb'],
        ['grams', 'g'],
        ['milliliters', 'mL'],
        ['liters', 'L'],
        ['pinches', 'pinch'],
    ])('maps %s to %s', (kind, expected) => {
        expect(measurements.mapMeasurementKind(kind)).toBe(expected);
    });

    it('ignores case when mapping', () => {
        expect(measurements.mapMeasurementKind('TEASPOON')).toBe('tsp');
        expect(measurements.mapMeasurementKind('Grams')).toBe('g');
    });

    it('returns unknown kinds unchanged', () => {
        expect(measurements.mapMeasurementKind('Cloves')).toBe('Cloves');
    });

    it.each([null, undefined, ''])('returns an empty string for %s', (kind) => {
        expect(measurements.mapMeasurementKind(kind)).toBe('');
    });
});
