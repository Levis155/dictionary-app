import { useState } from "react";
import "./AppContainer.css";
import { FaSearch } from "react-icons/fa";
import MoonLoader from "react-spinners/MoonLoader";

function AppContainer() {
  const [wordTyped, setWordTyped] = useState("");
  const [definitionData, setDefinitionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wordTitle, setWordTitle] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();

    try {
        setLoading(true);
        setError(null);
        setDefinitionData(null); 
        setWordTitle(null);
      
        const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${wordTyped}`
      );

      if (!response.ok) {
        throw new Error("There was an error please try again");
      }


      const data = await response.json();
      setDefinitionData(data);
      setWordTitle(wordTyped)
      console.log(data);
    
    } catch{
      setError("oops! could not find the definition of that.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
        <p className="copyright-text">&copy; 2025. built by levis. </p>
      <form>
        <input
          type="text"
          value={wordTyped}
          onChange={(e) => setWordTyped(e.target.value)}
          placeholder="search word here"
        />
        <button onClick={handleSearch} disabled={loading}><FaSearch /></button>
      </form>



      {loading && <div className="loader-container"><MoonLoader color="#24c49e" size={200} /></div>}

      {error && <div className="error-message-container"><h1 className="error-message">{error}</h1></div>}

      {!loading && !error && definitionData && (
        <WordCardsContainer definitionData={definitionData} />
      )}
    </div>
  );

  function WordCardsContainer({ definitionData }) {
    return (
      <div className="word-cards-container">
        <p className="container-title"><span className="title-span">word: </span>{wordTitle}</p>

        {definitionData[0].meanings.map((meaning, index) => (
          <WordCard
            key={index}
            wordSearched={wordTyped}
            index={index + 1}
            partOfSpeech={meaning.partOfSpeech}
            definitions={meaning.definitions}
          />
        ))}
      </div>
    );
  }

  function WordCard({ index, partOfSpeech, definitions }) {
    const firstFiveDefinitions = definitions.slice (0, 5);


    return (
      <div className="word-card">
        <h2 className="card-title">({index}) {wordTitle} as {partOfSpeech}</h2>
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