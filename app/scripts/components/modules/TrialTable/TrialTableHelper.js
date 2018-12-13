/**
 * Download a file. Be sure to set the file header (e.g. data:text/csv;charset=utf-8,)
 * @param {string} content
 * @param {string} fileType
 * @param {string} fileName
 */
export function triggerDownload(content, fileType, fileName) {
  const blob = new Blob([content], {type: fileType});
  const a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() {
    URL.revokeObjectURL(a.href);
  }, 1500);
}
