export const required = value => value ? undefined : '*Povinné';
export const password = value => value && value.length > 4 ? undefined : '*Min 5 znaků';
export const email = value => !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? '*Neplatný formát e-mail adresy' : undefined;
export const isNumeric = value => isNaN(Number(value)) ? '*Zadejte číselnú hodnotu' : undefined;
export const max100 = value => !value || (value && value.length <= 100) ? undefined : '*Maximálně 100 znaků.';
