import React from "react";
import "./App.css";

var gTR;

function init() {
  window.addEventListener(
    "message",
    function(ev) {
      if (ev.data && ev.data.mqfEditor) {
        var event = ev.data.mqfEditor.event;
        var data = ev.data.mqfEditor.data;

        if (event == "edit") {
          // 편집할 Asset
          document.getElementById("assetId").value = data.value;

          gTR = data;

          search(data.type, data.value);
        } else if (event == "reset") {
          // 화면 Reset
          gTR = undefined;

          document.getElementById("assetId").value = "";
          document.getElementById("preview").innerHTML = "";
        }
      }
    },
    false
  );
}

//  Asset을 Search
function search(type, id) {
  if (type == "image") type = "I";
  else if (type == "audio") type = "A";
  else if (type == "video") type = "V";

  var url = "http://aspenux.com/tool/ecc/asset/" + type + "/" + id;

  if (type == "I") {
    document.getElementById("preview").innerHTML =
      '<img style="max-width:100%;" src="' + url + '"/>';
  } else if (type == "A") {
    document.getElementById("preview").innerHTML =
      '<audio controls style="max-width:100%;" src="' + url + '"/>';
  } else if (type == "V") {
    document.getElementById("preview").innerHTML =
      '<video controls style="max-width:100%;" src="' + url + '"/>';
  }
}

const onClickSearch = () => {
  if (gTR) search(gTR.type, document.getElementById("assetId").value);
};

//  결과를 Editor로 전송함. %%INFO Asset이 존재하면, 항상 JSON의 구성상으로는 Madatory이므로 값이 없으면 전송하지 않음
function set() {
  var value = document.getElementById("assetId").value;

  if (!(gTR && value)) return;

  window.parent.postMessage(
    {
      mqfEditor: {
        event: "onSetMeta",
        data: {
          target: gTR.target,
          trId: gTR.trId,
          type: gTR.type,
          value: value
        }
      }
    },
    "*"
  );
}

function App() {
  init();

  return (
    <>
      PANDO - ASSET MANAGER
      <br />
      <br />
      ID <input id="assetId" type="text"></input>{" "}
      <span onClick={onClickSearch}>[Search]</span>{" "}
      <span onClick={set}>[Set]</span>
      <br />
      <div id="preview"></div>
    </>
  );
}

export default App;
