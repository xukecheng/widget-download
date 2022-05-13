import React from "react";
import {
  useActiveCell,
  useRecord,
  useFields,
  useActiveViewId,
} from "@vikadata/widget-sdk";
import { Button } from "@vikadata/components";

export const Download = () => {
  const viewId = useActiveViewId();
  const fields = useFields(viewId);

  const activeCell = useActiveCell();
  if (activeCell) {
    localStorage.setItem("attachment_recordId", activeCell.recordId);
  }
  const activeRecord = useRecord(localStorage.getItem("attachment_recordId"));

  const allFile = new Array();

  function findDownloadField() {
    const attachmentFieldIds = new Array();
    fields.map(
      (field) =>
        field.type === "Attachment" && attachmentFieldIds.push(field.id)
    );
    if (attachmentFieldIds.length != 0) {
      attachmentFieldIds.map((fieldId) => {
        if (activeRecord.getCellValue(fieldId)) {
          activeRecord.getCellValue(fieldId).map((data) => allFile.push(data));
        }
      });
    } else {
      alert("没有需要下载的附件");
      return;
    }
  }

  const initXMLhttp = () => {
    var xmlhttp;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
  };

  /**
   * 获取 blob
   * @param  {String} url 目标文件地址
   * @return {Promise}
   */
  function getBlob(url) {
    return new Promise((resolve) => {
      // const xhr = new XMLHttpRequest()
      const xhr = initXMLhttp();
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        }
      };

      xhr.send();
    });
  }

  /**
   * 保存
   * @param  {Blob} blob
   * @param  {String} filename 想要保存的文件名称
   */
  function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement("a");
      const body = document.querySelector("body");
      if (filename.indexOf(".txt") >= 0) {
        link.href = window.URL.createObjectURL(
          new Blob(["\uFEFF", blob], { type: "text/plain;charset=utf-8" })
        );
      } else {
        link.href = window.URL.createObjectURL(blob);
      }
      link.download = filename;

      // fix Firefox
      link.style.display = "none";
      body.appendChild(link);

      link.click();
      body.removeChild(link);

      window.URL.revokeObjectURL(link.href);
    }
  }

  /**
   * 下载
   * @param  {String} url 目标文件地址
   * @param  {String} filename 想要保存的文件名称
   */
  function download(url, filename) {
    getBlob(url).then((blob) => {
      saveAs(blob, filename);
    });
  }

  function downloadAll() {
    findDownloadField();
    if (allFile.length != 0) {
      allFile.map((file) => download(file.url, file.name));
    } else {
      alert("没有需要下载的附件");
    }
  }

  return (
    <div>
      {activeCell ? (
        <Button
          color="primary"
          onClick={() => downloadAll()}
          style={{ width: "200px" }}
        >
          下载该条记录中的所有附件
        </Button>
      ) : localStorage.getItem("attachment_recordId") ? (
        <Button onClick={() => downloadAll()} style={{ width: "230px" }}>
          下载上次选择记录里的所有附件
        </Button>
      ) : (
        <p>还没有选择过记录</p>
      )}
    </div>
  );
};
