export const nextId = (type, records) => {
   const lastId = records
    .filter(r => r.type_id && r.type_id.startsWith(type))
    .map(r => r.type_id.substring(r.type_id.indexOf("_")+1, r.type_id.length))
    .map(r => parseInt(r))
    .sort((a,b) => a-b)
    .pop();

    const nextId = type.concat("_").concat(parseInt(lastId) + 1);
    return  nextId;
    
}
    