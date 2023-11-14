export async function convertValue(
	value: number,
	type: 'currency' | 'weight' | 'measure'
) {
	try {
		let response: number = 0;
		switch (type) {
			//Peso
			case 'weight':
				response = value * 1000;
				break;
			//Medida
			default:
				response = value * 100;
				break;
		}

		return parseInt(response.toFixed(2));
	} catch (error) {
		return error;
	}
}
