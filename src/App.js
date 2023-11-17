import "./styles.css";

import axios from "axios";
import { useState, useEffect, useRef } from "react";

export default function App() {
  const [term, setTerm] = useState("Flutter");
  const [debounceSearch, setDebounceSearch] = useState(term);
  const [result, setresult] = useState([]);
  const prevStateTerm = useRef();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounceSearch(term);
    }, 1200);
    return () => clearTimeout(timeOut);
  }, [term]);

  useEffect(() => {
    const search = async () => {
      const response = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          origin: "*",
          format: "json",
          srsearch: term,
        },
      });
      setresult(response.data.query.search);
    };
    search();

  }, [debounceSearch]);

  useEffect(() => {
    prevStateTerm.current = term;
  })

  const prevTerm = prevStateTerm.current;
  
  const fetchResult = result.map((el, index) => {
    return (
      <tr key={el.pageid}>
        <th scope="row">{index + 1}</th>
        <td>{el.title}</td>
        <td>
          <span dangerouslySetInnerHTML={{ __html: el.snippet }} />
        </td>
      </tr>
    );
  });

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className="col-3"></div>
          <div className="col-6">
            <div className="my-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Search Input
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                onChange={(e) => setTerm(e.target.value)}
                value={term}
              />
            </div>
            <h3>{ prevTerm }</h3>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Desc</th>
                </tr>
              </thead>
              <tbody>{fetchResult}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
