import convert from 'xml-js';

function xmlToJSON(xmls: any) {
	let json = convert.xml2json(xmls, { compact: true, spaces: 4 });
	let jsonObj = { ...JSON.parse(json) };

	return jsonObj;
}

function jsonToXml(json: any) {
	let xml = convert.js2xml(json, { compact: true, spaces: 4 });
	return xml;
}

export { xmlToJSON, jsonToXml };
