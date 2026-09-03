export function contractEquipmentItems(contract = {}) {
  const items=Array.isArray(contract.equipmentItems)?contract.equipmentItems.filter(Boolean).slice(0,3):[];
  return items.length?items:[contract.equipment||{}];
}

export function equipmentSubtotal(items = [], pricing = {}) {
  return pricing.equipmentPricingMode==="per_item"&&items.length>1
    ? items.reduce((sum,item)=>sum+finiteMoney(item?.price),0)
    : finiteMoney(pricing.subtotal);
}

export function equipmentPrice(item, contract, count) {
  if(contract.pricing?.equipmentPricingMode==="per_item"&&count>1)return finiteMoney(item?.price);
  return count===1?finiteMoney(contract.pricing?.subtotal):null;
}

function finiteMoney(value){const number=Number(value||0);return Number.isFinite(number)&&number>=0?number:0}
