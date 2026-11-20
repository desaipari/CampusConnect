
import { useState } from 'react';

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  getLabel,
  getSearchText
}) {

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const selected = options.find(
    (option) => String(option.id) === String(value)
  );

  const results = query.trim().length < 2
    ? []
    : options.filter((option) =>
        getSearchText(option)
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      ).slice(0, 10);

  function selectOption(option) {
    onChange(String(option.id));
    setQuery('');
    setOpen(false);
  }

  return (
    <div className="search-select">

      <div className="search-select-input">

        <input
          type="text"
          value={
            open
              ? query
              : selected
                ? getLabel(selected)
                : query
          }
          placeholder={placeholder}
          onFocus={() => {
            setQuery('');
            setOpen(true);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange('');
            setOpen(true);
          }}
          autoComplete="off"
        />

        {value && (
          <button
            type="button"
            className="clear-select"
            onClick={() => {
              onChange('');
              setQuery('');
              setOpen(false);
            }}
          >
            ×
          </button>
        )}

      </div>

      {open && (

        <div className="search-select-menu">

          {query.trim().length < 2 ? (

            <div className="search-select-message">
              Type at least 2 characters to search.
            </div>

          ) : results.length === 0 ? (

            <div className="search-select-message">
              No matching records found.
            </div>

          ) : (

            results.map((option) => (

              <button
                type="button"
                key={option.id}
                className="search-select-option"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(option)}
              >
                {getLabel(option)}
              </button>

            ))

          )}

        </div>

      )}

    </div>
  );
}

export default SearchableSelect;
