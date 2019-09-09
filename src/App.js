import React, { useEffect, useState } from 'react';
import './App.css';
import {
  getStarWarsCharacters,
  pageCharacters,
  searchCharacters
} from "./services";

const checkLink = (value) => {
  return typeof value === "string" ? value.indexOf("http") === 0 ? true : false: false;
}

export const Table = ({results}) => (
  <div className="table">
  {
    results.length ?
    <table border="0">
      <thead>
        <tr>
          {
            Object.keys(results[0]).length ?
            Object.keys(results[0]).map(key => <td className={key} key={key}>{key}</td>)
            : null
          }
        </tr>
      </thead>
    <tbody>
      {
        results.length ?
        results.map((result, index) => {
          return <tr className="search-result" key={index}>{
            Object.keys(result).map((value, key) => (
                <td className={value} key={key}>
                  { checkLink(result[value]) ?
                    <a key={key} target="_blank" rel="noopener noreferrer" href={result[value]}>{result[value]}</a>
                    : Array.isArray(result[value]) ? result[value].map((value, key) => ( checkLink(value) ? <a key={key} href={value} target="_blank">{value}</a> : value )) : result[value]
                  }
                </td>
              )
            )
          }</tr>
        })
        : null
      }
    </tbody>
    </table>
    : <div className="loading-container"><p>No results, sorry... try another search term</p></div>
  }
  </div>
)

function App() {
  let [results, updateResults] = useState({});
  let [pagerState, updatePagerState] = useState({prev: null, next: null, totalPages: 1});
  let [page, updatePage] = useState(1);
  let [isLoading, setIsLoading] = useState(true);
  let [query, updateQuery] = useState("");
  let timeout = 0;

  const updateTable = res => {
    setIsLoading(false);
    updateResults(res.results)
    updatePagerState({next: res.next, previous: res.previous, totalPages: Math.ceil(res.count/10)})
  }

  const debounce = ({delay, func}) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func();
        timeout = null;
      }, delay);
    } else {
      timeout = 0;
    }
  }

  const handlePager = (event) => {
    const btnName = event.target.getAttribute("name");
    setIsLoading(true);

    if (btnName === "next") {
      updatePage(++page);
    } else {
      updatePage(--page);
    }

    console.log({query});

    pageCharacters({page: page, query})
      .then(updateTable);
  }

  const handleSearch = (event) => {
    event.persist();
    setIsLoading(true);
    const func = () => {
      if (event.target) {
        searchCharacters({q: event.target.value})
        .then(res => {
          updateQuery(event.target.value);
          updatePage(1);
          updateTable(res);
        });
      }
    }

    debounce({func, delay: 100});
  }

  useEffect(() => {
    getStarWarsCharacters()
      .then(res => {
        setIsLoading(false);
        updatePagerState({next: res.next, previous: res.previous, totalPages: Math.ceil(res.count/10)})
        updateResults(res.results)
      })
  }, []);

  return (
    <>
      <input
        className="search-bar"
        placeholder="Search for your start wars character"
        onChange={handleSearch}
      />{
        isLoading ? <div className="loading-container"><p>Loading results...</p></div> :
        <Table results={results}/>
      }
      <div className="flexbox-container">
        { pagerState.previous && !isLoading ? <button name="back" onClick={handlePager}>Back</button>: null }
        { pagerState.next && !isLoading ? <button name="next" onClick={handlePager}>Next</button> : null }
        { results.length && !isLoading ? <p>Page {page} of {pagerState.totalPages}</p> : null }
      </div>
    </>
  );
}

export default App;
