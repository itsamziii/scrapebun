"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Trash2,
  ChevronDown,
  Plus,
  GripVertical,
  ChevronRight,
} from "lucide-react";
import type { Property, PropertyType } from "../../../lib/types";
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
    <div className="divide-y divide-white/10 rounded-lg border border-white/10">
      <div className="bg-white/5 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-white/70">
              Field Name
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
              <SelectContent className="border-white/10 bg-black">
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="object">Object</SelectItem>
                <SelectItem value="array">Array</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!isNested && property.type !== "null" && (
          <div className="mt-4">
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
      </div>

      {isNested && (
        <div className="bg-white/5 p-4">
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

          <div className="space-y-4">
            {(property.type === "object"
              ? property.properties
              : property.items
            )?.map((nested) => (
              <PropertyEditor
                key={nested.id}
                property={nested}
                onChange={updateNestedProperty}
                onRemove={removeNestedProperty}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end bg-white/5 p-4">
        <Button variant="destructive" onClick={() => onRemove(property.id)}>
          <Trash2 size={16} className="mr-1" /> Remove Property
        </Button>
      </div>
    </div>
  );
};

interface PropertyListProps {
  properties: Property[];
  onSelect: (property: Property) => void;
  onRemove: (id: string) => void;
  selectedId: string | undefined;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  onSelect,
  onRemove,
  selectedId,
  onReorder,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const dragOverItemIndex = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    dragOverItemIndex.current = index;
  };

  const handleDragEnd = () => {
    if (
      draggedIndex !== null &&
      dragOverItemIndex.current !== null &&
      draggedIndex !== dragOverItemIndex.current
    ) {
      onReorder(draggedIndex, dragOverItemIndex.current);
    }
    setDraggedIndex(null);
    dragOverItemIndex.current = null;
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderPropertyItem = (prop: Property, index: number, depth = 0) => {
    const isExpanded = expandedIds.has(prop.id);
    const hasChildren =
      (prop.type === "object" &&
        prop.properties &&
        prop.properties.length > 0) ||
      (prop.type === "array" && prop.items && prop.items.length > 0);

    return (
      <React.Fragment key={prop.id}>
        <div
          className={`flex items-center px-3 py-2 ${
            index % 2 === 0 ? "bg-white/5" : "bg-white/10"
          } ${
            selectedId === prop.id
              ? "border-l-2 border-blue-500 bg-blue-500/10"
              : ""
          } ${draggedIndex === index ? "opacity-50" : ""} group cursor-pointer transition-colors`}
          onClick={() => onSelect(prop)}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          draggable={depth === 0}
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
        >
          {depth === 0 && (
            <div className="mr-2 cursor-grab text-white/50 opacity-0 transition-opacity group-hover:opacity-100">
              <GripVertical size={16} />
            </div>
          )}

          {hasChildren ? (
            <button
              className="mr-1 text-white/50 transition-colors hover:text-white/70"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(prop.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          ) : (
            <div className="w-5"></div>
          )}

          <div className="flex flex-1 items-center">
            <span className="font-medium text-white/70">{prop.name}</span>
            <span className="ml-2 rounded bg-white/10 px-2 py-0.5 text-xs text-white/50">
              {prop.type}
            </span>

            {prop.type !== "object" &&
              prop.type !== "array" &&
              prop.type !== "null" && (
                <span className="ml-2 max-w-[150px] truncate text-xs text-white/50">
                  {prop.type === "string" && `"${prop.value}"`}
                  {prop.type === "number" && 1}
                  {prop.type === "boolean" && (prop.value ? "true" : "false")}
                </span>
              )}

            {prop.type === "object" && prop.properties && (
              <span className="ml-2 text-xs text-white/50">
                {prop.properties.length}{" "}
                {prop.properties.length === 1 ? "property" : "properties"}
              </span>
            )}

            {prop.type === "array" && prop.items && (
              <span className="ml-2 text-xs text-white/50">
                {prop.items.length} {prop.items.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {depth === 0 && (
            <button
              className="text-white/50 opacity-0 transition-colors group-hover:opacity-100 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(prop.id);
              }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {isExpanded && hasChildren && (
          <>
            {prop.type === "object" &&
              prop.properties &&
              prop.properties.map((nestedProp, nestedIndex) =>
                renderPropertyItem(nestedProp, nestedIndex, depth + 1),
              )}
            {prop.type === "array" &&
              prop.items &&
              prop.items.map((item, itemIndex) =>
                renderPropertyItem(item, itemIndex, depth + 1),
              )}
          </>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="divide-y divide-white/10 overflow-hidden rounded-md border border-white/10">
      {properties.map((prop, index) => renderPropertyItem(prop, index))}
    </div>
  );
};
