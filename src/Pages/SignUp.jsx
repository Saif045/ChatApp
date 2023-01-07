import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link as LLink } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  auth,
  db,
  facebookProvider,
  googleProvider,
  storage,
} from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Add from "../img/addAvatar.png";
import { doc, setDoc } from "firebase/firestore";
import { MuiFileInput } from "mui-file-input";
import { useNavigate, Link } from "react-router-dom";
import { FacebookRounded } from "@mui/icons-material";

const theme = createTheme();

export default function SignUp() {
  const [err, setErr] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
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
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  const signInWithGoogle = () => {
    setLoading(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
        setDoc(doc(db, "userChats", user.uid), {});
        navigate("/");
      })
      .catch((error) => {
        setErr(true);
        setLoading(false);
        console.log(error);
      });
  };

  const signInWithFacebook = () => {
    setLoading(true);

    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        const user = result.user;
        setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
        setDoc(doc(db, "userChats", user.uid), {});
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
                 onClick={signInWithFacebook}
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}>
                <FacebookRounded className="  absolute left-4" />
                Facebook
              </Button>

              <Button
                style={{ "backgroundColor": "black" }}
                onClick={signInWithGoogle}
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

{
  /** <input type="file" id="file" label="file" className="hidden" />
                <label className="flex items-center" htmlFor="file">
                  <img className="w-8 mx-2" src={Add} />
                  <span className="opacity-75 font-sans">Add an avatar</span>
                </label> 




                <Button
               onClick={signInWithFacebook}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 1 }}
              disabled={loading}>
              <FacebookRounded className="  w-7 absolute left-4" />
              Continue with Facebook
            </Button>

            <Button
              onClick={signInWithGoogle}
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}>
              <img
                src="/assets/google.png"
                alt=""
                className=" w-7 absolute left-4 "
              />
              Continue with Google
            </Button>
            */
}
