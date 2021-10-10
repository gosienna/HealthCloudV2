let iframe=document.getElementById("ContentPlaceHolder1_MainList")
let all_tabs=document.getElementById("ContentPlaceHolder1_tab").children

//set main trigger, when content has been completed loaded
iframe.onload=function(){
    //Check ID in storage, if it is empty or different from current ID, re-initialize the data		
    chrome.storage.local.get(null,function(model){
        let current_tab_title = document.getElementById("ContentPlaceHolder1_tab").querySelectorAll('.active')[0].title
        model.current_tab_title = current_tab_title
        //console.log('onload',model)
        ID_current=document.getElementById("ContentPlaceHolder1_lbluserID").innerText
        ID_stored=model.ID
        if(ID_stored != ID_current){// new ID card
            console.log('new ID!')
            chrome.storage.local.clear()
            //close the first and second warning page
            document.getElementById('btnClose3').click()
            document.getElementById('btnClose2').click()
            //if it is a new ID card, renew the data
            let array_tab_name=[]
            for(let i = 0; i < all_tabs.length; i++){
                array_tab_name.push(all_tabs[i].title)
            }
            model={
                "ID":ID_current,
                //target tab titles
                target_tabs:["雲端藥歷","檢查檢驗紀錄","檢查檢驗結果","出院病歷摘要"],
                //tabs availible
                tabs_availible:array_tab_name,
                //current tab title index in target_tabs
                current_tab_index: 0,
                //flag to show wheather all tab has been screened 
                tab_complete: false,
                //flag to show wheather all the page under same tab has been screened
                page_complete: false
            }
            
            controller.dispatch(model)

        }else{                      //same person continue extraction
            controller.dispatch(model)
        }

    })
}



let controller={
    //function to dispatch task
    dispatch: function dispatch(model){
        switch(model.tab_complete){
            //all complete
            case true:
                console.log('all tab complete!')
                show_data(model)
            break
            //tab not complete yet    
            case false:
                switch(model.page_complete){
                    //click the next page
                    case false:
                        console.log('extracting')
                        controller.extract_table_content(model)
                        console.log(model)
                        
                        this.click_page(model)
                    break
                    //current tab extraction complate    
                    case true:
                        console.log('page extractioin complete!')
                        this.click_tab(model)	
                    break
                }
            break
        }
    },

    extract_table_content: function(model){
         if(iframe.contentDocument.getElementById('ContentPlaceHolder1_gvList') != null){
            let all_rows=iframe.contentDocument.getElementById('ContentPlaceHolder1_gvList').querySelectorAll('tr')
            //get current tab name
            let current_tab_name=document.getElementById("ContentPlaceHolder1_tab").querySelectorAll('.active')[0].innerText
            let table_head=[]
            iframe.contentDocument.getElementById('ContentPlaceHolder1_gvList').querySelectorAll('tr')[0].querySelectorAll('th').forEach(element => {
                table_head.push(element.innerText)     
            })
            
            //initialized the data container
            if(model[current_tab_name] == undefined){
                model[current_tab_name]=[]
            }
            for(let i = 1; i < all_rows.length ; i++){
                //initialized new object for every new row
                let row={}
                for(let j = 0 ; j < table_head.length ; j++){
                    row[table_head[j]]=all_rows[i].children[j].innerText
                }
                model[current_tab_name].push(row)
            }
           
        }
        
    },
    
    //click next tab
    click_tab: function(model){
        //find the next target tab title index in the availible tabs title
        let current_tab_index=model.current_tab_index+1
        let i = model.tabs_availible.indexOf(model.target_tabs[current_tab_index])
        console.log('length',model.target_tabs.length)
        while(i === -1 && current_tab_index < model.target_tabs.length ){
            console.log('while current tab',current_tab_index)
            current_tab_index++
            i = model.tabs_availible.indexOf(model.target_tabs[current_tab_index])
        }
        
        if(i != -1){
            model.page_complete = false
            model.current_tab_index = current_tab_index
            chrome.storage.local.set(model,function(){
                all_tabs[i].children[0].click()
			})
        }else{
            model.tab_complete = true
            model.page_complete = true
            chrome.storage.local.set(model,function(){
                controller.dispatch(model)
			})
        }
    },
    //click next page
    click_page: function(model){
        let div=iframe.contentDocument.getElementById("ContentPlaceHolder1_pg_gvList")
		if(div === null){ //if there is only one page		
			model.page_complete = true
			chrome.storage.local.set(model,function(){
                controller.dispatch(model)
			})
		}else{            //if there is more than on page
			//click the next page button
			let all_buttons=div.children
			let index_tab_button=div.querySelectorAll('span')[0].innerText
			let max_num_button=all_buttons.length-5
			
			if(parseFloat(index_tab_button) != max_num_button ){ //if current button is not at the largest availible button
				//save data and click
                chrome.storage.local.set(model,function(){	
                    all_buttons[parseFloat(index_tab_button)+2].click()	
				})
			}else{      //all page has been screen 
				model.page_complete = true
				this.dispatch(model)
			}	
							
		}
    }
}


