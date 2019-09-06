import React from 'react';
import ReactDOM from 'react-dom';
import App, { Table } from './App';
import Enzyme, { mount } from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import { getStarWarsCharacters } from "./services";
import { act } from "react-dom/test-utils";
Enzyme.configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  const div = document.createElement('div');
  act(() => {
    ReactDOM.render(<App />, div);
  })
  ReactDOM.unmountComponentAtNode(div);
});

describe('Load results into table', () => {
  let wrapper = null;

  beforeEach(() => {
    return getStarWarsCharacters()
      .then(res => {
        act(() => {
          wrapper = mount(<Table results={res.results}/>);
        })
      })
  });

  it("on page load", () => {
    act(() => {
      expect(wrapper.find(".search-result").length).toBeGreaterThan(1);
    })
  })
})
