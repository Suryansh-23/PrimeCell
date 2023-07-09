// write a function to convert a hexadecimal number to binary number

export const hexToBinary = (hex: string) => {
	let binary = '';
	let digit = 0;
	for (let i = 0; i < hex.length; i++) {
		digit = parseInt(hex[i], 16);
		binary += digit.toString(2).padStart(4, '0');
	}
	return binary;
};

export const binaryToHex = (binary: string) => {
	let hex = '';
	let digit = 0;
	for (let i = 0; i < binary.length; i += 4) {
		digit = parseInt(binary.slice(i, i + 4), 2);
		hex += digit.toString(16);
	}
	return hex;
};

export const getRandomHex = (length: number) => {
	let hex = '';
	for (let i = 0; i < length; i++) {
		hex += Math.floor(Math.random() * 16).toString(16);
	}
	return hex;
};

export const binaryToDecimal = (binary: string) => {
	try {
		const tmp = parseInt(binary, 2);
		return tmp.toPrecision(Math.ceil(Math.log10(tmp)));
	} catch {
		return '0'.repeat(77);
	}
};

export const hexToDecimal = (hex: string) => {
	try {
		const tmp = parseInt(hex, 16);
		return tmp.toPrecision(Math.ceil(Math.log10(tmp)));
	} catch {
		return '0'.repeat(77);
	}
};
