import React, { useState } from 'react';

interface ArrayFieldEditorProps {
  fieldName: string;
  label: string;
  value: any[];
  onChange: (value: any[]) => void;
  itemTemplate: Record<string, any>;
  renderItem: (item: any, index: number, onChange: (newItem: any) => void, onRemove: () => void) => React.ReactNode;
}

export const ArrayFieldEditor: React.FC<ArrayFieldEditorProps> = ({
  fieldName: _fieldName,
  label,
  value = [],
  onChange,
  itemTemplate,
  renderItem,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleAddItem = () => {
    const newItem = { ...itemTemplate, id: Date.now() };
    onChange([...value, newItem]);
  };

  const handleUpdateItem = (index: number, newItem: any) => {
    const updated = [...value];
    updated[index] = newItem;
    onChange(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="array-field-editor">
      <div className="array-field-header">
        <label>{label}</label>
        <div className="array-field-actions">
          <span className="item-count">{value.length} items</span>
          <button
            type="button"
            className="toggle-button"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '▸' : '▾'}
          </button>
        </div>
      </div>
      
      {!collapsed && (
        <div className="array-field-content">
          {value.length === 0 ? (
            <p className="empty-message">No {label.toLowerCase()} added yet</p>
          ) : (
            <div className="array-items">
              {value.map((item, index) => (
                <div key={item.id || index} className="array-item">
                  <div className="item-header">
                    <span className="item-number">{index + 1}</span>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => handleRemoveItem(index)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="item-content">
                    {renderItem(
                      item,
                      index,
                      (newItem) => handleUpdateItem(index, newItem),
                      () => handleRemoveItem(index)
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <button
            type="button"
            className="add-item-button"
            onClick={handleAddItem}
          >
            + Add {label.slice(0, -1)}
          </button>
        </div>
      )}
    </div>
  );
};

// Specific array field renderers
export const renderImageItem = (
  item: any,
  _index: number,
  onChange: (newItem: any) => void
) => (
  <>
    <input
      type="url"
      placeholder="Image URL"
      value={item.url || ''}
      onChange={(e) => onChange({ ...item, url: e.target.value })}
    />
    <input
      type="text"
      placeholder="Caption (optional)"
      value={item.caption || ''}
      onChange={(e) => onChange({ ...item, caption: e.target.value })}
    />
  </>
);

export const renderLinkItem = (
  item: any,
  _index: number,
  onChange: (newItem: any) => void
) => (
  <>
    <input
      type="text"
      placeholder="Link title"
      value={item.title || ''}
      onChange={(e) => onChange({ ...item, title: e.target.value })}
    />
    <input
      type="url"
      placeholder="URL"
      value={item.url || ''}
      onChange={(e) => onChange({ ...item, url: e.target.value })}
    />
    <input
      type="url"
      placeholder="Icon URL (optional)"
      value={item.icon || ''}
      onChange={(e) => onChange({ ...item, icon: e.target.value })}
    />
  </>
);

export const renderMenuCategory = (
  category: any,
  index: number,
  onChange: (newCategory: any) => void
) => (
  <div className="menu-category">
    <input
      type="text"
      placeholder="Category name"
      value={category.name || ''}
      onChange={(e) => onChange({ ...category, name: e.target.value })}
    />
    <ArrayFieldEditor
      fieldName={`items_${index}`}
      label="Items"
      value={category.items || []}
      onChange={(items) => onChange({ ...category, items })}
      itemTemplate={{ name: '', description: '', price: '' }}
      renderItem={renderMenuItem}
    />
  </div>
);

export const renderMenuItem = (
  item: any,
  _index: number,
  onChange: (newItem: any) => void
) => (
  <>
    <input
      type="text"
      placeholder="Item name"
      value={item.name || ''}
      onChange={(e) => onChange({ ...item, name: e.target.value })}
    />
    <input
      type="text"
      placeholder="Description (optional)"
      value={item.description || ''}
      onChange={(e) => onChange({ ...item, description: e.target.value })}
    />
    <input
      type="text"
      placeholder="Price"
      value={item.price || ''}
      onChange={(e) => onChange({ ...item, price: e.target.value })}
    />
    <input
      type="url"
      placeholder="Image URL (optional)"
      value={item.image || ''}
      onChange={(e) => onChange({ ...item, image: e.target.value })}
    />
  </>
);