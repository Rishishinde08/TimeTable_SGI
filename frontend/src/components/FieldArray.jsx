import React from 'react';
import './FieldArray.css';

export default function FieldArray({ items, setItems, schema }) {

  function add() {
    setItems([...items, schema()]);
  }

  function update(i, key, val) {
    const copy = [...items];
    copy[i] = { ...copy[i], [key]: val };
    setItems(copy);
  }

  function remove(i) {
    setItems(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="field-array">
      {items.map((it, i) => (
        <div key={i} className="field-item">
          {Object.keys(schema()).map(k => (
            <input
              key={k}
              placeholder={k}
              value={it[k] || ''}
              onChange={e => update(i, k, e.target.value)}
            />
          ))}
          <button type="button" onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={add} className="add-button">+ Add</button>
    </div>
  );
}
