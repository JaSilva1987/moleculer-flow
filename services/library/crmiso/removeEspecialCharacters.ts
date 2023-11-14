export async function removeEspecialCharacters(
	verifyText: string
): Promise<string> {
	if (!verifyText) {
		return '';
	}

	const trimmedText: string = verifyText.trim();

	if (trimmedText === '') {
		return '';
	}

	let cleanedText = trimmedText
		.replace(/[ÀÁÂÃÄÅ]/g, 'A')
		.replace(/[àáâãäå]/g, 'a')
		.replace(/[ÈÉÊË]/g, 'E')
		.replace(/[èéẽêë]/g, 'e')
		.replace(/[ÌÍÎÏ]/g, 'I')
		.replace(/[ìíîï]/g, 'i')
		.replace(/[ÒÓÔÖÕ]/g, 'O')
		.replace(/[òóõôö]/g, 'o')
		.replace(/[ÙÚÛÜ]/g, 'U')
		.replace(/[ùúûü]/g, 'u')
		.replace(/[Ç]/g, 'C')
		.replace(/[ç]/g, 'c')
		.replace(/[^a-z0-9:\-,.\s]/gi, '');

	return cleanedText;
}
