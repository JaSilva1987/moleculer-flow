export async function padTo2Digits(num: number) {
	return num.toString().padStart(2, '0');
}

export async function formatDate(date: {
	getFullYear: () => any;
	getMonth: () => number;
	getDate: () => any;
	getHours: () => any;
	getMinutes: () => any;
	getSeconds: () => any;
}) {
	const data =
		[
			date.getFullYear(),
			await padTo2Digits(date.getMonth() + 1),
			await padTo2Digits(date.getDate())
		].join('-') +
		' ' +
		[
			await padTo2Digits(date.getHours()),
			await padTo2Digits(date.getMinutes()),
			await padTo2Digits(date.getSeconds())
		].join(':');
	return data;
}
