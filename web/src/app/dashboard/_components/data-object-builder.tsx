"use client";
import { useState, useCallback, useEffect } from "react";
import { PropertyEditor } from "./property-editor";
import { PropertyList } from "./property-list";
import { v4 as uuidv4 } from "uuid";
import type { Property } from "../../../lib/types";
import { Button } from "~/components/ui/button";

export const DataObjectBuilder: React.FC<{
  onObjectChange?: (object: Record<string, any>) => void;
}> = ({ onObjectChange }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  const generateJsonObject = useCallback(() => {
    const result: Record<string, any> = {};
    const processProperty = (prop: Property): any => {
      switch (prop.type) {
        case "string":
          return prop.value;
        case "number":
          return parseFloat(prop.value as string) || 0;
        case "boolean":
          return Boolean(prop.value);
        case "array":
          return (prop.items || []).map(processProperty);
        case "object":
          if (prop.properties && prop.properties.length > 0) {
            const nestedObj: Record<string, any> = {};
            prop.properties.forEach((nestedProp) => {
              nestedObj[nestedProp.name] = processProperty(nestedProp);
            });
            return nestedObj;
          }
          return {};
        default:
          return prop.value;
      }
    };

    properties.forEach((prop) => {
      result[prop.name] = processProperty(prop);
    });

    return result;
  }, [properties]);

  useEffect(() => {
    const generatedObject = generateJsonObject();
    onObjectChange?.(generatedObject);
  }, [properties, generateJsonObject, onObjectChange]);

  const addProperty = useCallback(() => {
    const newProperty: Property = {
      id: uuidv4(),
      name: "newField",
      type: "string",
      value: "",
    };
    setProperties((prev) => [...prev, newProperty]);
    setSelectedProperty(newProperty);
  }, []);

  const updateProperty = useCallback((updatedProperty: Property) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p)),
    );
  }, []);

  const removeProperty = useCallback((id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setSelectedProperty(null);
  }, []);

  const selectProperty = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  const reorderProperties = useCallback(
    (fromIndex: number, toIndex: number) => {
      setProperties((prev) => {
        const result = [...prev];
        const [removed] = result.splice(fromIndex, 1);
        if (removed) {
          result.splice(toIndex, 0, removed);
        }
        return result;
      });
    },
    [],
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="space-y-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Data Fields</h2>

            <Button
              className="bg-white/5 text-white hover:bg-white/10"
              onClick={addProperty}
            >
              + Add Field
            </Button>
          </div>

          {properties.length === 0 ? (
            <div className="py-8 text-center text-white/50">
              <p>
                No properties added yet. Click "Add Field" to start building
                your object.
              </p>
            </div>
          ) : (
            <PropertyList
              properties={properties}
              onSelect={selectProperty}
              onRemove={removeProperty}
              selectedId={selectedProperty?.id}
              onReorder={reorderProperties}
            />
          )}
        </div>

        {selectedProperty && (
          <div className="animate-fadeIn rounded-lg border border-white/10 bg-white/5 p-4">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Edit Field
            </h2>
            <PropertyEditor
              property={selectedProperty}
              onChange={(updated) => {
                updateProperty(updated);
                setSelectedProperty(updated);
              }}
              onRemove={removeProperty}
            />
          </div>
        )}
      </div>
    </div>
  );
};
