import React from 'react'
import PropTypes from 'prop-types'
import Collapsible from 'react-collapsible'
import '../App.css'

import { Field, Checkbox } from 'bloomer'

import startCase from 'lodash/startCase'

// const size = {
//   fontSize: '13px',
//   padding: '10px',
//   height: 'auto',
//   width: '400px',
//   margin: 'auto',
//   marginTop: '15px',
//   minWidth: '300px',
//   marginBottom: '50px',
//   borderRadius: '4px',
//   color: 'white',
//   backgroundColor: 'rgb(36,36,36)',
//   border: '1px solid rgb(52, 53, 54)',
// };

const margin = {
  marginRight: '6px',
  textAlign: 'center',
  backgroundColor: 'red'
}

const field = {
  padding: '10px',
  marginRight: '5px'
}

const Filters = props => {
  const { filters, glossaries, toggleFilter } = props

  return (
    <div
      className='filtercontainer'
      style={{
        width: '400px',
        margin: 'auto',
        marginTop: '15px',
        marginBottom: '30px'
      }}
    >
      {Object.entries(filters).map(([cat, catFilters]) => {
        const { [cat]: glossary } = glossaries

        return (
          <Field
            key={cat}
            style={{
              backgroundColor: 'rgb(36,36,36)',
              padding: '20px',
              border: '1px solid rgb(52, 53, 54)',
              borderRadius: '4px'
            }}
          >
            <Collapsible
              style={margin}
              transitionTime={300}
              trigger={
                <div style={{ height: '100%' }}>
                  <strong>{startCase(cat)}</strong>
                </div>
              }
            >
              {Object.entries(catFilters).map(([id, checked]) => (
                <div key={id}>
                  <Checkbox
                    {...{ key: id, checked }}
                    readOnly
                    style={field}
                    onClick={() => toggleFilter(cat, id)}
                  >
                    {glossary[id].name === 'PC (Microsoft Windows)'
                      ? 'Windows'
                      : glossary[id].name}
                  </Checkbox>
                </div>
              ))}
            </Collapsible>
          </Field>
        )
      })}
    </div>
  )
}

Filters.propTypes = {
  filters: PropTypes.objectOf(PropTypes.object).isRequired,
  glossaries: PropTypes.objectOf(PropTypes.object).isRequired,
  toggleFilter: PropTypes.func.isRequired
}

export default Filters
