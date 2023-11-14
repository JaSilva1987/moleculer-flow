import {
	xmlToJSON,
	jsonToXml
} from '../../../services/library/shared/xlm-json';

describe('::Testes ::XML-JSON', () => {
	it('Deve converter XML em JSON corretamente', () => {
		const xml = `
      <root>
        <item>
          <name>Item 1</name>
          <value>100</value>
        </item>
        <item>
          <name>Item 2</name>
          <value>200</value>
        </item>
      </root>
    `;

		const expectedJSON = {
			root: {
				item: [
					{
						name: {
							_text: 'Item 1'
						},
						value: {
							_text: '100'
						}
					},
					{
						name: {
							_text: 'Item 2'
						},
						value: {
							_text: '200'
						}
					}
				]
			}
		};

		const result = xmlToJSON(xml);

		expect(result).toEqual(expectedJSON);
	});

	function stripWhiteSpace(str: string) {
		return str.replace(/\s/g, ''); // Remove todos os espaços em branco
	}

	test('Deve converter JSON em XML corretamente', () => {
		const jsonData = {
			root: {
				item: [
					{
						name: {
							_text: 'Item 1'
						},
						value: {
							_text: '100'
						}
					},
					{
						name: {
							_text: 'Item 2'
						},
						value: {
							_text: '200'
						}
					}
				]
			}
		};

		const expectedXml = `
		<root>
			<item>
			<name>Item 1</name>
			<value>100</value>
			</item>
			<item>
			<name>Item 2</name>
			<value>200</value>
			</item>
		</root>
		`;

		const result = jsonToXml(jsonData);

		expect(stripWhiteSpace(result)).toEqual(stripWhiteSpace(expectedXml));
	});
});
