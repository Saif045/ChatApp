import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, facebookProvider, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FacebookRounded } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  createChatDocuments,
  createUserDocuments,
} from "../components/useSignDocs";

const theme = createTheme();

export default function SignIn() {
  const [err, setErr] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { saif } = React.useContext(AuthContext);
  const { dispatch } = React.useContext(ChatContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  const signInWithProvider = (Provider) => {
    setLoading(true);
    signInWithPopup(auth, Provider)
      .then(async (res) => {
        await createUserDocuments(res);
        await createChatDocuments(res, saif);
        dispatch({ type: "CHANGE_USER", payload: saif });
        navigate("/");
      })
      .catch((error) => {
        setErr(true);
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 1 }}>
              Sign In
            </Button>

            <Typography component="center" variant="overline" className=" py-1">
              or continue with
            </Typography>

            <Grid item xs={12} className="grid grid-cols-2 gap-2 pb-2">
              <Button
                onClick={() => signInWithProvider(facebookProvider)}
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}>
                <FacebookRounded className="  absolute left-4" />
                Facebook
              </Button>

              <Button
                style={{ backgroundColor: "black" }}
                onClick={() => signInWithProvider(googleProvider)}
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}>
                <img
                  src="/assets/google.png"
                  alt=""
                  className=" w-7 absolute left-4 "
                />
                Google
              </Button>
            </Grid>

            {err && <span>Something went wrong</span>}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
