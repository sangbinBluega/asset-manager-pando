import React, { useState, useEffect } from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import ImageIcon from "@material-ui/icons/Image";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VideocamIcon from "@material-ui/icons/Videocam";
import SearchIcon from "@material-ui/icons/Search";
import Toolbar from "@material-ui/core/Toolbar";
import { Scrollbars } from "react-custom-scrollbars";
import Snackbar from "@material-ui/core/Snackbar";

const useStyles = makeStyles(theme => ({
  header: {
    width: "100%",
    height: "35px",
    backgroundColor: "rgb(121, 121, 121)",
    boxShadow: "none",
    position: "fixed",
    border: "0px",
    padding: "5px 5px 5px 10px",
    alignItems: "center"
  },
  toolBar: {
    minHeight: "0px"
  },
  title: {
    flexGrow: 1,
    paddingLeft: "10px"
  },
  label: {
    fontSize: "15px"
  },
  content: {
    position: "relative",
    top: "35px",
    width: "100%",
    height: "100%"
  },
  root: {
    padding: "20px"
  },
  media: {
    height: "150px",
    float: "left",
    width: "200px"
  },
  card: {
    padding: "10px",
    boxShadow:
      "1px 2px 1px 3px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)"
  },
  cardContent: {
    float: "left"
  },
  cardBottom: {
    display: "block"
  },
  buttons: {
    float: "right",
    marginTop: "16px"
  },
  icon: { marginTop: "20px", float: "left", color: "gray" }
}));

function App() {
  const classes = useStyles();
  const [assetData, setAssetData] = useState({
    data: [
      {
        index: "",
        id: "",
        url: "null",
        type: "",
        pathType: "",
        position: "",
        sequence: ""
      }
    ]
  });

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.addEventListener(
      "message",
      function(ev) {
        if (ev.data && ev.data.mqfEditor) {
          var event = ev.data.mqfEditor.event;
          var data = ev.data.mqfEditor.data;

          if (data.value) {
            let arrData = [];

            data.value.forEach(function(item, index) {
              let value = item.value;
              let data = item.data;
              let type = data.split("|")[1];
              let pathType =
                type === "image"
                  ? "I"
                  : type === "audio"
                  ? "A"
                  : type === "video" && "V";
              let url = `http://aspenux.com/tool/ecc/asset`;
              let position = data.split("|")[2];
              let sequence = data.split("|")[3] + "-" + data.split("|")[4];

              arrData.push({
                index: index,
                id: value,
                url: url,
                type: type,
                pathType: pathType,
                position: position,
                sequence: sequence
              });
            });

            setAssetData({
              data: arrData
            });
          }

          if (event === "edit") {
            window.parent.postMessage(
              { mqfEditor: { event: "showButton", data: "asset" } },
              "*"
            );
          } else if (event === "reset") {
          }
        }
      },
      false
    );
  }, []);

  const onClickSearch = pIdx => {
    var arrData = [];

    assetData.data.forEach((item, index) => {
      if (pIdx === index) {
        arrData.push({
          index: item.index,
          id: text,
          url: item.url,
          type: item.type,
          pathType: item.pathType,
          position: item.position,
          sequence: item.sequence
        });
      } else {
        arrData.push(item);
      }
    });

    setAssetData({
      data: arrData
    });
  };

  const onChangeText = e => {
    setText(e.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const onClickSet = pIdx => {
    assetData.data.some((item, index) => {
      if (pIdx === index) {
        let trId = `asset|${item.type}|${item.position}|${
          item.sequence.split("-")[0]
        }|${item.sequence.split("-")[1]}`;

        window.parent.postMessage(
          {
            mqfEditor: {
              event: "onSetMeta",
              data: {
                target: "assetManager",
                trId: trId,
                type: item.type,
                value: item.id
              }
            }
          },
          "*"
        );
        return pIdx === index;
      }
    });

    setOpen(true);
  };

  const buildCards = pData => {
    const list = pData.data.map((item, index) => {
      return (
        <div key={index} className={classes.root}>
          <Card className={classes.card}>
            <CardActionArea>
              {item.type === "image" ? (
                <CardMedia
                  className={classes.media}
                  image={`${item.url}/${item.pathType}/${item.id}`}
                />
              ) : item.type === "audio" ? (
                <CardMedia
                  className={classes.media}
                  component="audio"
                  image={`${item.url}/${item.pathType}/${item.id}`}
                  controls
                />
              ) : (
                item.type === "video" && (
                  <CardMedia
                    className={classes.media}
                    component="video"
                    image={`${item.url}/${item.pathType}/${item.id}`}
                    controls
                  />
                )
              )}

              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {item.position === "B"
                    ? "BODY"
                    : item.position === "C"
                    ? "CHOICE"
                    : item.position}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {item.id}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {item.sequence}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions className={classes.cardBottom}>
              <div className={classes.icon}>
                {item.type === "image" ? (
                  <ImageIcon />
                ) : item.type === "audio" ? (
                  <VolumeUpIcon />
                ) : (
                  item.type === "video" && <VideocamIcon />
                )}
              </div>

              <div className={classes.buttons}>
                <TextField
                  id="standard-basic"
                  label="ID"
                  style={{ marginTop: "-15px" }}
                  onChange={onChangeText}
                />
                <Button
                  size="small"
                  color="primary"
                  onClick={() => onClickSearch(index)}
                >
                  <SearchIcon />
                </Button>
                <Button
                  size="large"
                  color="primary"
                  onClick={() => onClickSet(index)}
                >
                  Set
                </Button>
              </div>
            </CardActions>
          </Card>
        </div>
      );
    });

    return list;
  };

  return (
    <>
      <AppBar className={classes.header}>
        <Toolbar className={classes.toolBar}>
          <Typography className={classes.title}>
            PANDO - ASSET MANAGER
          </Typography>
        </Toolbar>
      </AppBar>
      <Scrollbars>
        <div className={classes.content}>{buildCards(assetData)}</div>
      </Scrollbars>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        message="Success!"
      ></Snackbar>
    </>
  );
}

export default App;
