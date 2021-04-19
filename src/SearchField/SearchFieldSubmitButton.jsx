import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { SearchFieldContext } from './SearchFieldAdvanced';

import Button from '../Button';

const SearchFieldSubmitButton = (props) => {
  const { submitButtonLocation } = props;
  const { screenReaderText, icons, refs } = useContext(SearchFieldContext);

  const internalButton = (
    <button
      type="submit"
      className="btn"
      ref={refs.submitButton}
    >
      {icons.submit}
      <span className="sr-only">{screenReaderText.submitButton}</span>
    </button>
  );

  const externalButton = (
    <Button
      type="submit"
      className="btn-external"
      ref={refs.submitButton}
    >
      <span>{screenReaderText.submitButton}</span>
    </Button>
  );
  if (submitButtonLocation === 'external') {
    return externalButton;
  }

  return internalButton;
};

SearchFieldSubmitButton.propTypes = {
  /** specifies whether the search button is internal as an icon or external as a button. */
  submitButtonLocation: PropTypes.string,
};

SearchFieldSubmitButton.defaultProps = {
  submitButtonLocation: 'internal',
};

export default SearchFieldSubmitButton;
