import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./AppContainer.css";
import { FaSearch } from "react-icons/fa";
import MoonLoader from "react-spinners/MoonLoader";

function AppContainer() {
  const [searchedWord, setSearchedWord] = useState("");

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["fetch-definition", searchedWord],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchedWord}`
      );
      console.log(response.data);
      return response.data;
    },
    enabled: false,
  });

  function handleSearch(e) {
    e.preventDefault();
    refetch();
  }

  return (
    <div className="app-container">
      <p className="copyright-text">&copy; 2025. built by levis. </p>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchedWord}
          onChange={(e) => setSearchedWord(e.target.value)}
          placeholder="search word here"
        />
        <button disabled={isFetching}>
          <FaSearch />
        </button>
      </form>

      {isFetching && (
        <div className="loader-container">
          <MoonLoader color="#24c49e" size={200} />
        </div>
      )}

      {isError && (
        <div className="error-message-container">
          <h1 className="error-message">something went wrong.</h1>
        </div>
      )}

      {data && (
        <div className="word-cards-container">
          <p className="container-title">
            <span className="title-span">word: </span>
            {data[0].word}
          </p>

          {data[0].meanings.map((meaning, index) => (
            <WordCard
              key={index}
              index={index + 1}
              wordTitle={data[0].word}
              partOfSpeech={meaning.partOfSpeech}
              definitions={meaning.definitions}
            />
          ))}
        </div>
      )}
    </div>
  );

  function WordCard({ index, wordTitle, partOfSpeech, definitions }) {
    const firstFiveDefinitions = definitions.slice(0, 5);

    return (
      <div className="word-card">
        <h2 className="card-title">
          ({index}) {wordTitle} as {partOfSpeech}
        </h2>
        <ol className="definitions-list">
          {firstFiveDefinitions.map((def, index) => (
            <DefinitionContainer
              key={index}
              definition={def.definition}
              example={def.example}
            />
          ))}
        </ol>
      </div>
    );
  }

  function DefinitionContainer({ definition, example }) {
    return (
      <li className="definition-container">
        <p className="definition">{definition}</p>
        {example && (
          <div className="example-container">
            <p className="example">{example}</p>
          </div>
        )}
      </li>
    );
  }
}

export default AppContainer;
