const btn_start=document.getElementById('btn_start')
btn_start.addEventListener('click',function(){
    /* chrome.tabs.create({
        url: 'https://www.google.com.tw'
      }); */
    
    chrome.tabs.query({}, function(tabs){
        console.log(tabs);
    });
})
