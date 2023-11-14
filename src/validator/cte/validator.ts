import { TObject } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

interface ValidatorFactoryReturn<T> {
	schema: TObject;
	verify: (data: T) => T;
}

interface ValidatorFactoryReturn<T> {
	schema: TObject;
	verify: (data: T) => T;
}

export const validatorFactory = <T extends unknown>(
	schema: TObject
): ValidatorFactoryReturn<T> => {
	const C = TypeCompiler.Compile(schema);

	const verify = (data: any): any => {
		const isValid = C.Check(data);
		if (isValid) {
			return true;
		}
		return false;
	};

	return { schema, verify };
};
