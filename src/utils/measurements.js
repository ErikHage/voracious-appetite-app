const measurementDisplayMapper = {
    'cup': 'cups',
    'tablespoons': 'Tbsp',
    'tablespoon': 'Tbsp',
    'teaspoons': 'tsp',
    'teaspoon': 'tsp',
    'ounces': 'oz',
    'pounds': 'lb',
    'grams': 'g',
    'milliliters': 'mL',
    'liters': 'L',
    'pinches': 'pinch',
};

function mapMeasurementKind(kind) {
    if (!kind) {
        return '';
    }

    const mappedKind = measurementDisplayMapper[kind.toLowerCase()];

    if (!!mappedKind) {
        return mappedKind;
    }

    return kind;
}

export default {
    mapMeasurementKind,
}
