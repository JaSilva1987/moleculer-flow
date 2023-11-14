import { TObject } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Errors } from 'moleculer';

interface ValidatorFactoryReturn<T> {
	schema: TObject;
	verify: (data: T) => T;
}

export const validatorFactory = <T extends unknown>(
	schema: TObject
): ValidatorFactoryReturn<T> => {
	const C = TypeCompiler.Compile(schema);

	const verify = (data: T): T => {
		const isValid = C.Check(data);
		if (isValid) {
			return data;
		}
		throw new Errors.MoleculerError(process.env.FUNCIONAL_JSON, 432);
	};

	return { schema, verify };
};
