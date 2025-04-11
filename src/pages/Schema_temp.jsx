import React, { useState } from 'react';
import { generateSchema } from '../utility/generateFirebaseScema';

export default function SchemaInspector() {
  const [mainSchema, setMainSchema] = useState(null);
  const [subSchema, setSubSchema] = useState(null);
  const [collectionName, setCollectionName] = useState('Lists'); 
  const [subCollectionName, setSubCollectionName] = useState(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [includeSubcollections, setIncludeSubcollections] = useState(true);
  const [depth, setDepth] = useState(1);

  const handleSchemaGeneration = async () => {
    setIsLoading(true);
    setMainSchema(null);
    setSubSchema(null);

    try {
      const main = await generateSchema(collectionName, null, includeSubcollections, depth);
      setMainSchema(main);

      if (subCollectionName) {
        const sub = await generateSchema(`${collectionName}/GYjBMTdOGfXGaoKmHAB3/${subCollectionName}`, null, includeSubcollections, depth);
        setSubSchema(sub);
      }
    } catch (error) {
      console.error('Error generating schema:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (key, value, level = 0) => {
    const indent = `pl-${level * 4}`;

    if (value?.type === 'subcollection') {
      return (
        <div className={`${indent} mt-1`}>
          <span className="font-bold text-purple-600">{key}:</span>
          <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">subcollection</span>
          {value.schema && (
            <div className={`${indent} ml-4 border-l-2 border-purple-200 pl-4`}>
              {Object.entries(value.schema).map(([subKey, subValue]) => 
                renderField(subKey, subValue, level + 1)
              )}
            </div>
          )}
        </div>
      );
    }

    if (value?.type === 'object' && value.schema) {
      return (
        <div className={`${indent} mt-1`}>
          <span className="font-bold text-blue-600">{key}:</span>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">object</span>
          <div className={`${indent} ml-4 border-l-2 border-blue-200 pl-4`}>
            {Object.entries(value.schema).map(([subKey, subValue]) => 
              renderField(subKey, subValue, level + 1)
            )}
          </div>
        </div>
      );
    }

    if (value?.type === 'array') {
      return (
        <div className={`${indent} mt-1`}>
          <span className="font-bold text-green-600">{key}:</span>
          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            array{value.elementType ? ` of ${value.elementType}` : ''}
          </span>
          {value.elementSchema && (
            <div className={`${indent} ml-4 border-l-2 border-green-200 pl-4`}>
              {renderField('items', value.elementSchema, level + 1)}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`${indent} mt-1`}>
        <span className="font-bold text-gray-700">{key}:</span>
        <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
          {value?.type || typeof value}
        </span>
      </div>
    );
  };

  const renderSchemaBlock = (title, schema) => (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Schema for <span className="font-mono bg-gray-100 px-2 py-1 rounded">{title}</span>
      </h2>
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        {Object.keys(schema).length === 0 ? (
          <p className="text-gray-500">No fields found in this collection</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(schema).map(([key, value]) =>
              renderField(key, value)
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Firestore Schema Inspector</h1>

        <div className="flex flex-col space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Collection Name</label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., posts, users"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcollection Name</label>
            <input
              type="text"
              value={subCollectionName}
              onChange={(e) => setSubCollectionName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., comments, items"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeSubcollections"
                checked={includeSubcollections}
                onChange={(e) => setIncludeSubcollections(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeSubcollections" className="ml-2 text-sm text-gray-700">
                Include Subcollections
              </label>
            </div>

            {includeSubcollections && (
              <div className="flex items-center">
                <label htmlFor="depth" className="mr-2 text-sm text-gray-700">Depth:</label>
                <select
                  id="depth"
                  value={depth}
                  onChange={(e) => setDepth(parseInt(e.target.value))}
                  className="px-2 py-1 border rounded-md"
                >
                  {[1, 2, 3].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleSchemaGeneration}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Collection'}
          </button>
        </div>

        {mainSchema && renderSchemaBlock(collectionName, mainSchema)}
        {subSchema && renderSchemaBlock(`${collectionName}/${subCollectionName}`, subSchema)}
      </div>
    </div>
  );
}
