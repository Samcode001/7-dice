import { Box, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import diceImg from "../assets/dice-animation.gif";
import diceBG from "../assets/dice-bg.avif";
import { useNavigate } from "react-router-dom";

const GamePage = () => {
  const [points, setPoints] = useState(5000);
  const [randomNumber, setRandomNumber] = useState(null);

  const [result, setResult] = useState(null);
  const [resultFlag, setResultFlag] = useState(false);
  const [imageFlag, setImageFlag] = useState(false);
  const [winFlag, setWinFlag] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    betPoints: 0,
    bet: "",
  });
  const [selectedBetPoints, setSelectedBetPoints] = useState(null);
  const [selectedBet, setSelectedBet] = useState(null);

  const navigate = useNavigate();

  const handleBetClick = (bet) => {
    setSelectedBet(bet);
    setSelectedOptions((prev) => ({ ...prev, bet }));
  };
  const handleClick = (betPoints) => {
    setSelectedBetPoints(betPoints);
    setSelectedOptions((prev) => ({ ...prev, betPoints }));
  };
  const playGame = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) navigate("/login");

      const {
        data: { generatedNumber },
      } = await axios.get("http://localhost:3000/game/generateNumber", {
        headers: {
          authorization: "Bearer " + token,
        },
      });
      // console.log(generatedNumber);

      const { data } = await axios.post(
        "http://localhost:3000/game/userResult",
        {
          generatedNumber,
          betNumber: selectedOptions.bet,
        },
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      );

      console.log(data.result);

      setResultFlag(true);
      setImageFlag(true);

      setTimeout(() => {
        setImageFlag(false);
        setResult(data.result);
        setPoints(newPoints);
        setRandomNumber(generatedNumber);
        setWinFlag(true);
      }, 2000);

      const {
        data: { newPoints },
      } = await axios.post(
        "http://localhost:3000/game/setPoints",
        {
          userResult: result,
          betPoints: selectedOptions.betPoints,
        },
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      );

      // console.log(newPoints);

      setPoints(newPoints);
    } catch (error) {
      console.log(`Eror on Play Game Function :${error}`);
    }
  };

  const getPoints = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/game/getPoints", {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setPoints(data.userPoints);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPoints();
  }, []);

  return (
    <>
      <Container
        sx={{
          backgroundImage: `url(${diceBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "550px",
          height: "100vh",
          display: "block",
          marginInline: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ color: "gray", fontSize: "1.2rem", fontWeight: "700" }}
          >
            7DICE
          </Typography>
          <Typography
            sx={{ color: "gold", fontSize: "1.2.rem", fontWeight: "600" }}
          >
            Points:{points}
          </Typography>
          <Button variant="contained" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        </Box>

        <Box sx={{ position: "absolute", bottom: "3rem" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginBottom: "3rem",
            }}
          >
            {[100, 200, 500].map((betPoints) => (
              <Button
                key={betPoints}
                variant="contained"
                sx={{
                  background:
                    selectedBetPoints === betPoints
                      ? "gray"
                      : "linear-gradient(to right, #e65c00, #f9d423)",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "white",
                  "&:hover": {
                    background:
                      selectedBetPoints === betPoints
                        ? "darkgray"
                        : "linear-gradient(to right, #e65c00, #f9d423)",
                  },
                }}
                onClick={() => handleClick(betPoints)}
              >
                {betPoints}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginBottom: "3rem",
            }}
          >
            {[
              { label: "7 up", value: "7+" },
              { label: "7", value: "7" },
              { label: "7 Down", value: "7-" },
            ].map((bet) => (
              <Button
                key={bet.value}
                variant="contained"
                sx={{
                  background:
                    selectedBet === bet.value
                      ? "gray"
                      : "linear-gradient(to right, #e65c00, #f9d423)",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "white",
                  "&:hover": {
                    background:
                      selectedBet === bet.value
                        ? "darkgray"
                        : "linear-gradient(to right, #e65c00, #f9d423)",
                  },
                }}
                onClick={() => handleBetClick(bet.value)}
              >
                {bet.label}
              </Button>
            ))}
          </Box>
          <Button
            variant="contained"
            sx={{
              background:
                " linear-gradient(to right, #ada996, #f2f2f2, #dbdbdb, #eaeaea)",
              color: "gold",
              width: "400px",
              display: "block",
              marginInline: "auto",
              fontSize: "1.6rem",
              fontWeight: "700",
            }}
            onClick={playGame}
          >
            Play
          </Button>
        </Box>

        <Box
          sx={{
            display: !resultFlag ? "none" : "block",
            marginTop: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            style={{ display: !imageFlag ? "none" : "block" }}
            src={diceImg}
            alt=""
            width={300}
            height={300}
          />

          <Typography
            sx={{ fontSize: "3rem", fontWeight: "600", color: "gold" }}
          >
            {randomNumber}
          </Typography>

          {winFlag ? (
            <Typography
              sx={{ fontSize: "3rem", fontWeight: "600", color: "gold" }}
            >
              {result ? "Win" : "Lose"}
            </Typography>
          ) : (
            ""
          )}
        </Box>
        {/* <hr /> */}
      </Container>
    </>
  );
};

export default GamePage;
