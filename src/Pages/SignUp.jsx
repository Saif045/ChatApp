import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link as LLink } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, facebookProvider, googleProvider } from "../firebase";
import { MuiFileInput } from "mui-file-input";
import { useNavigate } from "react-router-dom";
import { FacebookRounded } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  createChatDocuments,
  createUserDocuments,
  UploadProfile,
} from "../components/useSignDocs";

const theme = createTheme();

export default function SignUp() {
  const [err, setErr] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const { saif } = React.useContext(AuthContext);
  const { dispatch } = React.useContext(ChatContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const displayName = data.get("firstName");

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
       UploadProfile(displayName, email, file, res);

      await createChatDocuments(res, saif);
      dispatch({ type: "CHANGE_USER", payload: saif });

      navigate("/");
    } catch (err) {
      setErr(true);
      setLoading(false);
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
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>

              <Grid item xs={12}>
                <MuiFileInput
                  value={file}
                  onChange={(newFile) => setFile(newFile)}
                  placeholder="Add an avatar (optional)"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
              disabled={loading}>
              Sign Up
            </Button>

            <Typography component="center" variant="overline" className=" py-1">
              or continue with
            </Typography>

            <Grid item xs={12} className="grid grid-cols-2 gap-2">
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

            {loading && "Uploading and compressing the image please wait..."}
            {err && <span> something went Wrong try again </span>}
            <Grid container justifyContent="flex-end">
              <Grid item sx={{ marginY: 1 }}>
                <LLink href="/signin" variant="body2">
                  Already have an account? Sign in
                </LLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
