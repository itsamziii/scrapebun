"use client";

import React, { useState, useEffect } from "react";
import { Trash2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import type { Property, PropertyType } from "./property";
import { v4 as uuidv4 } from "uuid";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";

interface PropertyEditorProps {
  property: Property;
  onChange: (property: Property) => void;
  onRemove: (id: string) => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  property,
  onChange,
  onRemove,
}) => {
  const [isNested, setIsNested] = useState(false);

  useEffect(() => {
    setIsNested(property.type === "object" || property.type === "array");
  }, [property.type]);

  const handleTypeChange = (newType: PropertyType) => {
    let updatedProperty = { ...property, type: newType };

    if (newType === "object") {
      updatedProperty.properties = updatedProperty.properties || [];
      delete updatedProperty.items;
    } else if (newType === "array") {
      updatedProperty.items = updatedProperty.items || [];
      delete updatedProperty.properties;
    } else {
      delete updatedProperty.properties;
      delete updatedProperty.items;

      updatedProperty.value =
        newType === "string"
          ? ""
          : newType === "number"
            ? "0"
            : newType === "boolean"
              ? false
              : null;
    }

    onChange(updatedProperty);
    setIsNested(newType === "object" || newType === "array");
  };

  const addNestedProperty = () => {
    if (property.type === "object") {
      const newProperties = [...(property.properties || [])];
      newProperties.push({
        id: uuidv4(),
        name: `property${newProperties.length + 1}`,
        type: "string",
        value: "",
        parentId: property.id,
      });
      onChange({ ...property, properties: newProperties });
    } else if (property.type === "array") {
      const newItems = [...(property.items || [])];
      newItems.push({
        id: uuidv4(),
        name: String(newItems.length),
        type: "string",
        value: "",
        parentId: property.id,
      });
      onChange({ ...property, items: newItems });
    }
  };

  const updateNestedProperty = (updatedNested: Property) => {
    if (property.type === "object" && property.properties) {
      const updatedProperties = property.properties.map((p) =>
        p.id === updatedNested.id ? updatedNested : p,
      );
      onChange({ ...property, properties: updatedProperties });
    } else if (property.type === "array" && property.items) {
      const updatedItems = property.items.map((item) =>
        item.id === updatedNested.id ? updatedNested : item,
      );
      onChange({ ...property, items: updatedItems });
    }
  };

  const removeNestedProperty = (id: string) => {
    if (property.type === "object" && property.properties) {
      const updatedProperties = property.properties.filter((p) => p.id !== id);
      onChange({ ...property, properties: updatedProperties });
    } else if (property.type === "array" && property.items) {
      const updatedItems = property.items
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, name: String(index) }));
      onChange({ ...property, items: updatedItems });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-white/70">
            Property Name
          </label>
          <Input
            value={property.name}
            onChange={(e) => onChange({ ...property, name: e.target.value })}
            placeholder="Enter property name"
            className="border-white/10 bg-white/5 text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/70">Type</label>
          <Select
            value={property.type}
            onValueChange={(value) => handleTypeChange(value as PropertyType)}
          >
            <SelectTrigger className="border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-ai-dark border-white/10">
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="object">Object</SelectItem>
              <SelectItem value="array">Array</SelectItem>
              <SelectItem value="null">Null</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!isNested && property.type !== "null" && (
        <div>
          <label className="mb-1 block text-sm text-white/70">Value</label>
          <Input
            type={property.type === "number" ? "number" : "text"}
            value={property.value as string}
            onChange={(e) => onChange({ ...property, value: e.target.value })}
            placeholder={`Enter ${property.type} value`}
            className="border-white/10 bg-white/5 text-white"
          />
        </div>
      )}

      {isNested && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm text-white/70">
              {property.type === "object" ? "Object Properties" : "Array Items"}
            </h3>
            <Button
              variant="outline"
              className="bg-white/5 text-white hover:bg-white/10"
              onClick={addNestedProperty}
            >
              <Plus size={14} /> Add{" "}
              {property.type === "object" ? "Property" : "Item"}
            </Button>
          </div>

          {((property.type === "object" &&
            (!property.properties || property.properties.length === 0)) ||
            (property.type === "array" &&
              (!property.items || property.items.length === 0))) && (
            <div className="py-3 text-center text-sm text-white/50">
              No {property.type === "object" ? "properties" : "items"} added
              yet.
            </div>
          )}

          {property.type === "object" &&
            property.properties &&
            property.properties.map((nestedProp) => (
              <NestedPropertyEditor
                key={nestedProp.id}
                property={nestedProp}
                onChange={updateNestedProperty}
                onRemove={removeNestedProperty}
                isArrayItem={false}
              />
            ))}

          {property.type === "array" &&
            property.items &&
            property.items.map((item, index) => (
              <NestedPropertyEditor
                key={item.id}
                property={item}
                onChange={updateNestedProperty}
                onRemove={removeNestedProperty}
                isArrayItem={true}
                arrayIndex={index}
              />
            ))}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button variant="destructive" onClick={() => onRemove(property.id)}>
          <Trash2 size={16} className="mr-1" /> Remove Property
        </Button>
      </div>
    </div>
  );
};

interface NestedPropertyEditorProps {
  property: Property;
  onChange: (property: Property) => void;
  onRemove: (id: string) => void;
  isArrayItem: boolean;
  arrayIndex?: number;
}

const NestedPropertyEditor: React.FC<NestedPropertyEditorProps> = ({
  property,
  onChange,
  onRemove,
  isArrayItem,
  arrayIndex,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded border border-white/10 bg-white/5">
      <div
        className="flex cursor-pointer items-center justify-between px-3 py-2 transition-colors hover:bg-white/10"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="text-sm text-white/70">
            {isArrayItem ? `[${arrayIndex}]` : property.name}
            <span className="ml-2 text-xs text-white/50">{property.type}</span>
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(property.id);
          }}
          className="text-white/50 hover:text-red-500"
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {expanded && (
        <div className="border-t border-white/10 bg-white/5 px-3 py-2">
          <div className="grid grid-cols-1 gap-3">
            {!isArrayItem && (
              <div>
                <label className="mb-1 block text-xs text-white/70">Name</label>
                <Input
                  value={property.name}
                  onChange={(e) =>
                    onChange({ ...property, name: e.target.value })
                  }
                  className="border-white/10 bg-white/5 text-white"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs text-white/70">Type</label>
              <Select
                value={property.type}
                onValueChange={(value) =>
                  onChange({ ...property, type: value as PropertyType })
                }
              >
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-ai-dark border-white/10">
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="null">Null</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {property.type !== "null" && (
              <div>
                <label className="mb-1 block text-xs text-white/70">
                  Value
                </label>
                <Input
                  type={property.type === "number" ? "number" : "text"}
                  value={property.value as string}
                  onChange={(e) =>
                    onChange({ ...property, value: e.target.value })
                  }
                  className="border-white/10 bg-white/5 text-white"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
