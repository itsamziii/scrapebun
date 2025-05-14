export type PropertyType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "null";

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  value: string | number | boolean | null;
  parentId?: string;
  properties?: Property[]; 
  items?: Property[]; 
  arrayItemType?: PropertyType;
}
