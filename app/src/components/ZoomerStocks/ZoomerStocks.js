// external
import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import axios from 'axios';

// components
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, CircularProgress } from '@material-ui/core';

const SUGGESTIONS_API = 'http://localhost:3000/suggestions/query=';

const ZoomerStocks = ({ className, formCtrl, required, error, setError }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  console.log(loading);
  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    if (query) {
      (async () => {
        const { data: stocks } = await axios({
          method: 'GET',
          url: `${SUGGESTIONS_API}${query}`,
        });
        if (active) {
          setOptions(
            stocks.map((stock) => ({
              company: stock.company,
              ticker: stock.ticker,
              id: stock._id,
            }))
          );
          setLoading(false);
          setError(false);
        }
      })();
    }
    return () => {
      active = false;
    };
  }, [loading, query]);

  useEffect(() => {
    if (query) {
      setLoading(true);
    } else {
      setLoading(false);
      setOptions([]);
    }
  }, [query]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
      setQuery('');
    }
  }, [open]);

  return (
    <div className={className}>
      <Autocomplete
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onChange={(_event, value) => formCtrl(value)}
        onInputChange={debounce((_event, value) => {
          setQuery(value);
        }, 300)}
        onClose={() => setOpen(false)}
        getOptionLabel={(option) => option.company}
        options={options}
        loading={loading}
        loadingText="Finding stocks..."
        renderInput={(params) => (
          <TextField
            {...params}
            helperText={error && 'Select a stock'}
            required={required}
            error={error}
            label="Choose a stock"
            fullWidth
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export default ZoomerStocks;