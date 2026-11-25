// Emulace metadat SharePointu pro testy seznamů. Položky seznamů obsluhuje daný test.
function schemaFixture() {
 const schemas = new Map();
 return function fieldsRequest(url, options, lists) {
  const path = new URL(url).pathname;
  const response = (data, status = 200) => ({ok:status < 400, status, json:async () => data});
  if (path.endsWith("/_api/contextinfo")) return response({FormDigestValue:"demo-digest"});
  const match = /\/getbytitle\('([^']+)'\)\/fields(?:\/getbyinternalnameortitle\('([^']+)'\))?$/.exec(path);
  if (!match) return null;
  const [, name, indexedField] = match;
  if (!lists[name]) return response({}, 404);
  if (!schemas.has(name)) schemas.set(name, new Map([["Title", {InternalName:"Title", FieldTypeKind:2, Indexed:false}]]));
  const fields = schemas.get(name);
  if (options.method !== "POST") return response({value:[...fields.values()]});
  if (indexedField) {
   if (!fields.has(indexedField)) return response({}, 404);
   fields.get(indexedField).Indexed = true;
  } else {
   const {Title, FieldTypeKind} = JSON.parse(options.body);
   if (fields.has(Title)) return response({}, 409);
   fields.set(Title, {InternalName:Title, FieldTypeKind, Indexed:false});
  }
  return response({});
 };
}
