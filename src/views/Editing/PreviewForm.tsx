import React from "react";
import { Icon } from "@iconify/react";

const PreviewForm = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      {cards.map((card, cardIndex) => {
        const width = parseInt(card.width) || 100;

        const getGridCols = () => {
          if (width >= 70 && width <= 80) return "lg:col-span-9";
          if (width >= 20 && width <= 30) return "lg:col-span-3";
          if (width >= 45 && width <= 55) return "lg:col-span-6";
          return "lg:col-span-12";
        };

        return (
          <div
            key={cardIndex}
            className={`col-span-12 ${getGridCols()} bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all`}
          >
            {/* Card Header */}
            {card.title && (
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <Icon icon="solar:document-line-duotone" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="text-sm text-gray-600">{card.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Card Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {card.children.map((child, index) => {
                const width = parseInt(child.width) || 100;

                const getSpan = () => {
                  if (child.type === "heading" || child.type === "heading2")
                    return "col-span-full";
                  if (width >= 80) return "col-span-full";
                  if (width >= 60) return "col-span-2";
                  return "col-span-1";
                };

                const spanClass = getSpan();

                return (
                  <div key={index} className={`${spanClass}`}>
                    {renderPreviewField(child)}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PreviewForm;

/* -------------------------------------
    FIELD PREVIEW RENDERING
-------------------------------------- */

const renderPreviewField = (field) => {
  switch (field.type) {
    case "heading":
      return (
        <h4 className="text-xl font-bold text-red-600 mb-2 flex items-center gap-2">
          <Icon icon="solar:document-line-duotone" className="w-5 h-5" />
          {field.content}
        </h4>
      );

    case "heading2":
      return (
        <p className="text-lg font-semibold text-gray-700 mb-2">
          {field.content}
        </p>
      );

    case "para":
      return (
        <p className="text-gray-600 text-sm leading-relaxed">{field.content}</p>
      );

    case "text":
    case "email":
    case "number":
    case "tel":
      return (
        <div>
          <label className="block text-sm font-semibold mb-1">
            {field.label}
          </label>
          <input
            readOnly
            className="w-full px-3 py-2 border bg-gray-100 rounded-md text-sm cursor-not-allowed"
            placeholder={field.placeholder}
          />
        </div>
      );

    case "date":
      return (
        <div>
          <label className="block text-sm font-semibold mb-1">
            {field.label}
          </label>
          <input
            type="date"
            readOnly
            className="w-full px-3 py-2 border bg-gray-100 rounded-md text-sm cursor-not-allowed"
          />
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <input type="checkbox" disabled />
          <label>{field.content}</label>
        </div>
      );

    case "select":
      return (
        <div>
          <label className="block text-sm font-semibold mb-1">
            {field.label}
          </label>
          <select
            disabled
            className="w-full px-3 py-2 border bg-gray-100 rounded-md text-sm"
          >
            <option>Select {field.label}</option>
          </select>
        </div>
      );

    case "file_button":
      return (
        <div className="p-3 border rounded-lg text-center bg-gray-50">
          <div className="w-20 h-20 bg-gray-200 mx-auto mb-2 rounded"></div>
          <p className="text-xs">{field.content}</p>
          <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded mt-2" disabled>
            Upload
          </button>
        </div>
      );

    default:
      return null;
  }
};
