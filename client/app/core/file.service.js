angular.module('cmsApp.core')
  .factory('FileService', function($window){
    'use strict';
    function destroyClickedElement(event){
      $window.document.body.removeChild(event.target);
    };
    return {
      writeText: function(name, text) {
        var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
          ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
          ieVer = (ie ? ie[1] : (ie11 ? 11 : -1));

        if (ie && ieVer < 10) {
          console.log("No blobs on IE ver<10");
          return;
        }
        var textAsBlob = new Blob([text], {type: 'text/plain'});

        if (ie || ie11) {
          window.navigator.msSaveBlob(textAsBlob, name);
        } else {
          var downloadLink = document.createElement('a');
          downloadLink.download = name;
          downloadLink.innerHTML = "download file";
          if ($window.webkitURL != null) {
            //Chrome allows the link to be clicked without actually adding it to the DOM
            downloadLink.href = $window.webkitURL.createObjectURL(textAsBlob);
          } else {
            downloadLink.href = $window.URL.createObjectURL(textAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            $window.document.body.appendChild(downloadLink);
          }
          downloadLink.click();
        }
      }
    };
});