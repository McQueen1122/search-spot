import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";
import { useState, useEffect } from "react";

const CLIENT_ID = 'abb394e8ecab4574b82f082d5ce3c8e4';
const CLIENT_SECRET = '51eda6232c4543f78dcc22b9937f27c9';
console.log(CLIENT_ID);

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, SetAlbums] = useState([]);

  useEffect(() => {
    // Fetching API Access Token
    const authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => {
        if (!result.ok) {
          throw new Error("Failed to fetch access token");
        }
        return result.json();
      })
      .then((data) => setAccessToken(data.access_token))
      .catch((error) => console.error("Error:", error));
  }, []);

  async function search() {
    console.log("Searching for " + searchInput);

    // Sending GET Request to search for artist ID
    const searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    var artistID = await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data?.artists?.items[0].id;
      })
      .catch((error) => console.error("Error:", error));

    // GET request to get all the albums data through artist ID

    var returnedAlbums = await fetch(
      `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`,
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        SetAlbums(data?.items);
      })
      .catch((error) => console.error("Error:", error));
  }
  return (
    <div className="app">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search For Artist"
            type="input"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>Search</Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4">
          {albums.map((album, id) => {
            return (
              <Card>
                <Card.Img src={album?.images[0].url} />
                <Card.Body>
                  <Card.Title>{album?.name}</Card.Title>
                  <Card.Link
                   target="_blank"
                    href={album?.external_urls?.spotify}
                    style={{
                      display: "inline-block",
                      padding: "10px",
                      border: "1px solid black",
                      borderRadius: "5px",
                      color: "black",
                      textDecoration: "none",
                      transition: "background-color 0.3s",
                    }}
                  >
                    Link To Album
                  </Card.Link>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
