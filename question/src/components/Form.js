import React, { useState } from "react";
import emailjs from "emailjs-com";
import {
  Container,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

const Survey = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [otherText, setOtherText] = useState({});

  const questions = [
    {
      id: 1,
      questionText:
        "How would you prefer to communicate with others for arranging skill swaps?",
      options: ["In-app messaging", "Email", "Phone call", "Other"],
    },
    {
      id: 2,
      questionText:
        "What factors would influence your trust in swapping skills with someone you haven't met before?",
      options: [
        "Reviews from others",
        "Verification of identity",
        "Clear descriptions of skills offered",
        "Other",
      ],
    },
  ];

  const handleChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
    // Reset the otherText if another option is selected
    if (answer !== "Other") {
      setOtherText({ ...otherText, [questionId]: "" });
    }
  };

  const handleOtherTextChange = (questionId, value) => {
    setOtherText({ ...otherText, [questionId]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedAnswers = questions
      .map((q) => {
        const answer =
          answers[q.id] === "Other"
            ? otherText[q.id] || "No answer"
            : answers[q.id] || "No answer";
        return `${q.questionText}: ${answer}`;
      })
      .join("\n");

    const emailParams = {
      name,
      email,
      answers: formattedAnswers,
    };

    emailjs
      .send(
        "service_ni5n9wg", // Replace with your EmailJS service ID
        "template_x5w6l46", // Replace with your EmailJS template ID
        emailParams,
        "66-W9af1LC1jM74qL" // Replace with your EmailJS user ID
      )
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        setMessage("Survey submitted successfully!");
        setOpenSnackbar(true);

        // Clear form fields
        setName("");
        setEmail("");
        setAnswers({});
        setOtherText({});
      })
      .catch((err) => {
        console.error("FAILED...", err);
        setMessage("Error submitting the survey.");
        setOpenSnackbar(true);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#2a9d8f" }}
        >
          Welcome to the SkillSwap Survey!
        </Typography>
        <Typography variant="body1" sx={{ color: "#555" }}>
          Thank you for participating! <br /> Please fill out your name, email,
          and answer the questions below. <br /> We appreciate your
          contribution!
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {questions.map((q) => (
          <FormControl key={q.id} component="fieldset" margin="normal">
            <FormLabel component="legend">{q.questionText}</FormLabel>
            <RadioGroup
              name={`question-${q.id}`}
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              row
            >
              {q.options.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {answers[q.id] === "Other" && (
              <TextField
                label="Please specify"
                variant="outlined"
                fullWidth
                margin="normal"
                value={otherText[q.id] || ""}
                onChange={(e) => handleOtherTextChange(q.id, e.target.value)}
              />
            )}
          </FormControl>
        ))}
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Box>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={message.includes("Error") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Survey;
