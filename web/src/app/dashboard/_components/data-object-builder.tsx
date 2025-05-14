"use client";
import { useState, useCallback, useEffect } from "react";
import type { ChangeEvent } from "react";
import { Copy, FileJson, AlertCircle } from "lucide-react";
import { PropertyEditor } from "./property-editor";
import { PropertyList } from "./property-list";
import { ObjectPreview } from "./object-preview";
import { v4 as uuidv4 } from "uuid";
import type { Property, PropertyType } from "./property";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

export const DataObjectBuilder: React.FC<{
  onObjectChange?: (object: Record<string, any>) => void;
}> = ({ onObjectChange }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState("");
  const [showImport, setShowImport] = useState(false);

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
      name: "newProperty",
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

  const copyToClipboard = useCallback(() => {
    const jsonString = JSON.stringify(generateJsonObject(), null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [generateJsonObject]);

  const importJson = useCallback(() => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(jsonInput);

      const convertToProperties = (
        obj: Record<string, any>,
        parentId?: string,
      ): Property[] => {
        return Object.entries(obj).map(([key, value]) => {
          const id = uuidv4();
          const type = getPropertyType(value);

          const newProp: Property = {
            id,
            name: key,
            type,
            value: type === "string" ? value : "",
            parentId,
          };

          if (type === "object" && value !== null) {
            newProp.properties = convertToProperties(value, id);
          } else if (type === "array") {
            newProp.items = (value as any[]).map((item, index) => {
              const itemId = uuidv4();
              const itemType = getPropertyType(item);

              const arrayItem: Property = {
                id: itemId,
                name: `${index}`,
                type: itemType,
                value: itemType === "string" ? item : "",
                parentId: id,
              };

              if (itemType === "object" && item !== null) {
                arrayItem.properties = convertToProperties(item, itemId);
              }

              return arrayItem;
            });
          } else if (type === "number") {
            newProp.value = String(value);
          } else if (type === "boolean") {
            newProp.value = value;
          }

          return newProp;
        });
      };

      const newProperties = convertToProperties(parsed);
      setProperties(newProperties);
      setShowImport(false);
      setJsonInput("");
    } catch (error) {
      setJsonError("Invalid JSON format. Please check and try again.");
    }
  }, [jsonInput]);

  const getPropertyType = (value: any): PropertyType => {
    if (Array.isArray(value)) return "array";
    if (value === null) return "null";
    if (typeof value === "object") return "object";
    return typeof value as PropertyType;
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="space-y-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Properties</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-white/5 text-white hover:bg-white/10"
                onClick={() => setShowImport(true)}
              >
                <FileJson size={16} /> Import JSON
              </Button>
              <Button
                className="bg-ai-primary hover:bg-ai-secondary text-white"
                onClick={addProperty}
              >
                + Add Property
              </Button>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="py-8 text-center text-white/50">
              <p>
                No properties added yet. Click "Add Property" to start building
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
              Edit Property
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

        {showImport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="mx-4 w-full max-w-md rounded-lg border border-white/10 bg-black p-6">
              <h2 className="mb-2 text-lg font-semibold text-white">
                Import JSON
              </h2>
              <p className="mb-4 text-white/70">
                Paste your JSON data below to import it into the builder.
              </p>

              <Textarea
                className="h-48 resize-none border-white/10 bg-white/5 text-white"
                value={jsonInput}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setJsonInput(e.target.value);
                  setJsonError(null);
                }}
                placeholder="Paste JSON here..."
              />

              {jsonError && (
                <div className="mt-2 flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle size={14} /> {jsonError}
                </div>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="bg-white/5 text-white hover:bg-white/10"
                  onClick={() => {
                    setShowImport(false);
                    setJsonInput("");
                    setJsonError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-ai-primary hover:bg-ai-secondary text-white"
                  onClick={importJson}
                  disabled={!jsonInput.trim()}
                >
                  Import
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
