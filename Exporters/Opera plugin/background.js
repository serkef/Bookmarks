//  Copyright 2016 Sergios Kefalas
//  
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//  
//      http://www.apache.org/licenses/LICENSE-2.0
//  
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.



var html='' //html var will hold the entire html code that will be dumped in a file finally

chrome.browserAction.onClicked.addListener(function(){
   initHtml(); //write the html header
   chrome.bookmarks.getTree(processTree); //main code lays here
})

function processTree(tree){
   //this function processes the entire bookmark tree
   //the for in the next line is just used to follow opera example; there's only 1 root in the tree
   tree.forEach(recursiveExportToHtml);   //this creates the html code for each bookmark
   exportHtmlFile(); //this exports the html file
}

function recursiveExportToHtml(node){
   if (node.url){
      //we are on a leaf of the tree (simple url)
      appendLinkToHtml(node.title, node.url);
   } else {
      //we are on a branch of the tree (folder)
      //we will write the folder in the html and then explore all chilren
      appendFolderToHtml(node.title);  
      node.children.forEach(recursiveExportToHtml);   //recursive loop for all links in folder
      appendFolderFinish();
   }
}

function initHtml(){
   //this functions writes the html header that will be used in the final output
   html = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n';
}

function appendLinkToHtml(title, url){
   //this function adds 1 line with 1 bookmark link
   html = html + '<DT><A HREF="' + url + '">' + title + '</A></DT>\n'
}

function appendFolderToHtml(title){
   //this function adds 1 line with 1 bookmark folder
   html = html + '<DT><H3>' + title + '</H3>\n<DL><p>\n';
}

function appendFolderFinish(title){
   //this function closes the html tag for bookmark folder
   html + html + '</DL><p>\n</DT>\n';
}

function exportHtmlFile(){
   //this function outputs the entire html code to a .html file
   var url = "data:text/html;charset=utf-8," + encodeURIComponent(html);
   chrome.downloads.download({url:url,filename:"Bookmarks.html"},function(){});
   chrome.runtime.sendMessage({reply:"Export Successful."},function(response){});
}
