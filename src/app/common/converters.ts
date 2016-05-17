/**
 * Created by Keyston on 4/7/2016.
 */

//https://blog.rsuter.com/angular-2-typescript-property-decorator-that-converts-input-values-to-the-correct-type/

// tslint:disable-next-line
export var StringConverter = (value: any) => {
  if (value === null || value === undefined || typeof value === 'string')
    return value;

  return value.toString();
};
// tslint:disable-next-line
export var BooleanConverter = (value: any) => {
  if (value === null || value === undefined || typeof value === 'boolean')
    return value;

  return value.toString() === 'true';
};
// tslint:disable-next-line
export var NumberConverter = (value: any) => {
  if (value === void 0 || value === undefined || typeof value === 'number')
    return value;

  return parseFloat(value.toString());
};
export function InputConverter(converter?: (value: any) => any) {
  return (target: Object, key: string) => {
    if (converter === undefined) {
      // (<any>Reflect).getMetadata('design:type', target, key);
      let metadata = void 0;
      if (metadata === undefined || metadata === void 0)
        throw new Error('The reflection metadata could not be found.');

      if (metadata.name === 'String') {
        converter = StringConverter;
      } else if (metadata.name === 'Boolean') {
        converter = BooleanConverter;
      } else if (metadata.name === 'Number') {
        converter = NumberConverter;
      } else {
        throw new Error(`There is no converter for the given property type ${metadata.name}.`);
      }
    }

    let definition = Object.getOwnPropertyDescriptor(target, key);
    if (definition) {
      Object.defineProperty(target, key, {
        get: definition.get,
        set: newValue => {
          definition.set(converter(newValue));
        },
        enumerable: true,
        configurable: true
      });
    } else {
      Object.defineProperty(target, key, {
        get: function () {
          return this['__' + key];
        },
        set: function (newValue) {
          this['__' + key] = converter(newValue);
        },
        enumerable: true,
        configurable: true
      });
    }
  };
}

