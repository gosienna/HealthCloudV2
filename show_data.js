function show_data(model){
	let med_data=model["雲端藥歷"]
	//create main div element to hold infomation
	let main_div=document.createElement('div')
	main_div.setAttribute("id","main_div")
	//set the grid structure to hold the information
	main_div.innerHTML=`
	<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
	<symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
		<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
	</symbol>
	<symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
		<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
	</symbol>
	<symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
		<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
	</symbol>
	</svg>
	<nav class="navbar navbar-expand-lg navbar-dark" style="background: linear-gradient(to bottom, rgba(0, 0, 153, 1),rgb(2, 117, 216, 1))">
	<div class="container-fluid">
		<a class="navbar-brand" href="#">KW</a>
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarSupportedContent">
		<ul class="navbar-nav me-auto mb-2 mb-lg-0">
			<li class="nav-item">
				<button id="btn_new_pt" class="btn btn-outline-light mx-1" type="button">新病人請按我</button>
			</li>
			<li class="nav-item">
				<button class="btn btn-outline-light mx-1" type="button" data-bs-toggle="collapse" data-bs-target="#form1" aria-expanded="false" aria-controls="collapseExample">顯示原版雲端藥歷</button>	
			</li>
			<!--
			<li class="nav-item dropdown">
			<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
				Dropdown
			</a>
			<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
				<li><a class="dropdown-item" href="#">Action</a></li>
				<li><a class="dropdown-item" href="#">Another action</a></li>
				<li><hr class="dropdown-divider"></li>
				<li><a class="dropdown-item" href="#">Something else here</a></li>
			</ul>
			</li>
			<li class="nav-item">
			<a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
			</li>
			-->
		</ul>
		<form id="search-form" class="d-flex">
			<input id="search_input" class="form-control mx-1" type="search" placeholder="日期、藥物名、診所、檢驗項目...." aria-label="Search">
			<button class="btn btn-outline-light mx-1" type="submit">Search</button>
		<form>
	</div>
	</nav>
	`


	main_div.innerHTML += `
	<div class="container">
		<div class = "row">
			<div class="col-sm " >
				<ul class="list-group my-1" id="warning">
				</ul>
			</div>
		</div>
		<div class = "row">
			<div class="col-sm " id="wound_care"></div>
		</div>
		<div class = "row">
			<div class="col-sm " id="long_term_med"></div>
		</div>
		<div class = "row">
			<div class="col-sm " id="search_result"></div>
		</div>
 	</div>
	`
	
	let form=document.body.children[0]
	//make original contain collapsible
	form.classList.add('collapse')
	document.body.insertBefore(main_div,form)




	//=========================search and show result=============================
	let search_result=search(model,['抗血栓藥','Psycholeptics','廣安診所'])
	
	//show 廣安一個月內就診紀錄
	if(search_result.med_data['廣安診所'].length > 0){
		check_wound_care( document.getElementById('wound_care') ,search_result.med_data['廣安診所'])
	}
	
	 
	//show anti-thrombus warning
	if(search_result.med_data['抗血栓藥'].length > 0){
		let source = search_result.med_data['抗血栓藥'][0]['來源'].split('\n')[0]
		let date = search_result.med_data['抗血栓藥'][0]['就醫(調劑)日期(住院用藥起日)']
		let med = search_result.med_data['抗血栓藥'][0]['成分名稱']
		let msg = `<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
		`
		msg += `${source}於${date}開立${med}`
		warning( document.getElementById('warning') , msg )
	}

	
	//show BZD waring
	if(search_result.med_data['Psycholeptics'].length > 0){
		let source = search_result.med_data['Psycholeptics'][0]['來源'].split('\n')[0]
		let date = search_result.med_data['Psycholeptics'][0]['就醫(調劑)日期(住院用藥起日)']
		let med = search_result.med_data['Psycholeptics'][0]['成分名稱']
		let left= search_result.med_data['Psycholeptics'][0]["單筆\n餘藥\n日數\n試算"]
		if(left > 0){
			let msg=`<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>`
			msg += `${source}於${date}開立${med},仍有${left}天`
			warning( document.getElementById('warning') , msg )
		}
	}

	//screen for long term med
	//create table element for long term medicine
	let long_term_med=get_long_term_med(med_data)
	console.log(long_term_med)
	//show the most recent long term prescription
	if(long_term_med != undefined ){
		fill_long_term_med( document.getElementById('long_term_med') , long_term_med )
	}
	

	//=============================================================================
	

	//attach event listener to the button
	let btn_new_pt=document.getElementById('btn_new_pt')
	btn_new_pt.addEventListener('click',function(){
		//click the button for changing health card
		document.getElementById('ContentPlaceHolder1_btnReSrc').click()
	})


	//initialize the search element
	const searchForm = document.querySelector('#search-form')
	
	searchForm.addEventListener('search', function onSearchFormSubmitted(event)  {
	event.preventDefault()
	let target=document.getElementById('search_result')
	let input=document.querySelector('#search_input').value.trim().toLowerCase()
	show_search_result(target,model,[input])
	})
	searchForm.addEventListener('submit', function onSearchFormSubmitted(event)  {
	event.preventDefault()
	let target=document.getElementById('search_result')
	let input=document.querySelector('#search_input').value.trim().toLowerCase()
	show_search_result(target,model,[input])
	})


	
}

//----------------------code area for functions----------------------------------
//function for user to search data with key
function search(model,array_key){
	console.log('search',model)
	let search_result={
		med_data:{},
		lab_data:{},
	}
	//initialize the result with empty array
	array_key.forEach(function(key){
		search_result.med_data[key]=[]
		search_result.lab_data[key]=[]		
	})

	
	//search med_data
	let med_data=model['雲端藥歷']
	if(med_data != undefined){
		med_data.forEach(function(row){
			for(head in row){
				array_key.forEach(function(key){
					let contained = false
					if(row[head].toLowerCase().includes(key.toLowerCase())){
						contained = true
					}
					if(contained){
						search_result.med_data[key].push(row)
					}
				})
			}
		})
	}
	

	//search lab data
	let lab_data=model['檢查檢驗結果']
	if(lab_data != undefined){
		lab_data.forEach(function(row){
			for(head in row){
				array_key.forEach(function(key){
					let contained = false
					if(row[head].toLowerCase().includes(key.toLowerCase())){
						contained = true
					}
					if(contained){
						search_result.lab_data[key].push(row)
					}
				})
			}
		})
	}
	
	console.log('search result',search_result)
	return search_result
}


function get_long_term_med(med_data){
	if(med_data != undefined){
		let long_term_med=[]
		for(let i = 0 ; i < med_data.length ; i++){
			if(parseInt(med_data[i]['給藥\n日數']) >= 15){
				long_term_med.push(med_data[i])
			}
		}
		console.log('get_long_term_med',long_term_med)
		return long_term_med
	}
	
}

function fill_long_term_med(target,long_term_med){
	console.log(long_term_med)
	if(long_term_med.length > 0){
		go()
	}
	function go(){
		console.log(long_term_med)
		let div_long_term=document.createElement('div')
		//transform long term med info from array of object to HTML table format
		let card_HTML=`
			<div class="card mt-1 bg-primary">
				<div class="card-body" id="card-body">
					<h5 class="card-title text-white" >半年內長期處方</h5>
					<table class="table table-light table-striped mt-2 mb-2">
					<thead class="table table-light">		
						<tr>
							<th scope="col">餘藥(日)</th>
							<th scope="col">開藥天數</th>
							<th scope="col">開藥日期</th>
							<th scope="col">成份</th>
							<th scope="col">來源</th>
						</tr>
					</thead>
					<tbody>	  
					`	
		
		let source_list= []
		//display first long term prescirption
		let source = long_term_med[0]['來源'].split('\n')[0]
		source_list.push(source)
		card_HTML+= `
		<tr class="bg-light">
			<td scope="col">${long_term_med[0]['單筆\n餘藥\n日數\n試算']}</td>
			<td scope="col">${long_term_med[0]['給藥\n日數']}</td>
			<td scope="col">${long_term_med[0]['就醫(調劑)日期(住院用藥起日)']}</td>
			<td scope="col">${long_term_med[0]['成分名稱']}</td>
			<td scope="col">${source}</td>
		</tr>
		`
		let date = long_term_med[0]['就醫(調劑)日期(住院用藥起日)']
		let previous_date = date
		let new_source = true

		//顯示source不同的長期簽
		for(let i=1 ; i < long_term_med.length ; i++){
			date = long_term_med[i]['就醫(調劑)日期(住院用藥起日)']
			source = long_term_med[i]['來源'].split('\n')[0]
			//console.log(previous_source, source, source_list,!source_list.includes(source))
				
			if(date != previous_date){
				if(!source_list.includes(source)){
					new_source = true
					previous_date = date
					source_list.push(source)	
				}else{
					new_source = false
					previous_date = date
				}
			}

			if( new_source ){
				card_HTML+= `
				<tr class="bg-light">
					<td scope="col">${long_term_med[i]['單筆\n餘藥\n日數\n試算']}</td>
					<td scope="col">${long_term_med[i]['給藥\n日數']}</td>
					<td scope="col">${long_term_med[i]['就醫(調劑)日期(住院用藥起日)']}</td>
					<td scope="col">${long_term_med[i]['成分名稱']}</td>
					<td scope="col">${source}</td>
				</tr>
				`
			}
			
		}
		
		card_HTML+=`</tbody></table></div></div>`
		div_long_term.innerHTML=card_HTML
		target.appendChild(div_long_term)
	}
}



function check_wound_care(target, result){
	console.log('check wound care', result)
	let div_wound_care=document.createElement('div')	
	let current = new Date()
	let current_time=new Date(current.getFullYear(),current.getMonth(),current.getDate())
	let card_HTML=`
		<div class="card bg-primary">
			<div class="card-body" id="card-body">
				<h5 class="card-title text-white" >廣安一個月內就診紀錄</h5>
				<table class="table table-striped mt-2 mb-2">
				<thead class="table bg-light">		
					<tr>
						<th scope="col">就診日期</th>
						<th scope="col">診斷</th>	
					</tr>
				</thead>
				<tbody>	  
				`	
	
	let raw_time=result[0]['就醫(調劑)日期(住院用藥起日)'].split('/')
	prescription_time=new Date(parseInt(raw_time[0])+1911,parseInt(raw_time[1])-1,parseInt(raw_time[2]))		
	//first row
	let day_difference=(current_time.getTime()-prescription_time.getTime())/(1000*60*60*24)
	let old_time=result[0]['就醫(調劑)日期(住院用藥起日)']
	console.log(raw_time)
	
	//只顯示本月
	if(prescription_time.getMonth() === current_time.getMonth()){
		//若只隔一天且是外傷,顯示警語
		
		if(day_difference === 1 && (result[0]['主診斷'].includes('損傷') || result[0]['主診斷'].includes('傷口') || result[0]['主診斷'].includes('燒傷') ||result[0]['主診斷'].includes('咬傷')||result[0]['主診斷'].includes('皮膚良性腫廇'))){ // if had visist yesterday
			card_HTML+= `
			<tr class="bg-light">
				<td scope="col">${result[0]['就醫(調劑)日期(住院用藥起日)']}<span class="bg-danger text-white">昨日就診請掛療程</span></td>
				<td scope="col">${result[0]['主診斷'].split('\n')[0]}</td>
			</tr>
			`
			go()
		}else{
		card_HTML+= `
			<tr class="bg-light">
				<td scope="col">${result[0]['就醫(調劑)日期(住院用藥起日)']}</td>
				<td scope="col">${result[0]['主診斷'].split('\n')[0]}</td>
			</tr>
			`
			go()
		}	
	}
	

	function go(){
		//add following row
		let count=1		
		for(let i=1 ; i < result.length ; i++ ){
			raw_time=result[i]['就醫(調劑)日期(住院用藥起日)'].split('/')
			let new_time=result[i]['就醫(調劑)日期(住院用藥起日)']
			prescription_time=new Date(parseInt(raw_time[0])+1911,parseInt(raw_time[1])-1,parseInt(raw_time[2]))
			console.log(prescription_time.getMonth(),current_time.getMonth())
			if(new_time != old_time && prescription_time.getMonth() === current_time.getMonth()){
				count++
				card_HTML+= `
				<tr class="bg-light">
					<td scope="col">${result[i]['就醫(調劑)日期(住院用藥起日)']}</td>
					<td scope="col">${result[i]['主診斷'].split('\n')[0]}</td>
				</tr>
				`
			}
			old_time = new_time		
		}
			
		card_HTML+=`</tbody></table></div></div>`
		div_wound_care.innerHTML=card_HTML
		target.appendChild(div_wound_care)
		let span_count=document.createElement('span')
		span_count.innerHTML=':  共'+count.toString()+'次'
		div_wound_care.querySelector('.card-title').appendChild(span_count)
	}
}




//function to form table content into div_search_result to append in to grid system
function show_search_result(target,model,input){
	target.innerHTML=``
	let all_result=search(model,input)
	//if there are result from med_data
	let search_result=all_result.med_data[input[0]]	
	if(search_result.length != 0){
		let card_HTML=`
			<div class="card mt-1 bg-primary">
				<div class="card-body" id="card-body">
					<h5 class="card-title text-white" >搜尋結果</h5>
					<table class="table table-light table-striped mt-2 mb-2">
					<thead class="table table-light">		
						<tr>
							<th scope="col">餘藥(日)</th>
							<th scope="col">開藥天數</th>
							<th scope="col">開藥日期</th>
							<th scope="col">成份</th>
							<th scope="col">品名</th>
							<th scope="col">來源</th>
							<th scope="col">ATC3</th>
							<th scope="col">診斷</th>
						</tr>
					</thead>
					<tbody>	  
					`	
		
		console.log(search_result)

		for(let i=0 ; i < search_result.length ; i++ ){
			card_HTML+= `
			<tr class="bg-light">
				<td scope="col">${search_result[i]['單筆\n餘藥\n日數\n試算']}</td>
				<td scope="col">${search_result[i]['給藥\n日數']}</td>
				<td scope="col">${search_result[i]['就醫(調劑)日期(住院用藥起日)']}</td>
				<td scope="col">${search_result[i]['成分名稱']}</td>
				<td scope="col">${search_result[i]['藥品名稱']}</td>
				<td scope="col">${search_result[i]['來源']}</td>
				<td scope="col">${search_result[i]['ATC3名稱']}</td>
				<td scope="col">${search_result[i]['主診斷']}</td>
			</tr>
			`
		}			
		card_HTML+=`</tbody></table></div></div>`
		let div_search_result=document.createElement('div')
		div_search_result.innerHTML=card_HTML
		target.appendChild(div_search_result)
	}
	//show lab search result
	search_result = all_result.lab_data[input[0]]
	if(search_result.length !=0){
		let card_HTML=`
			<div class="card mt-1 bg-primary">
				<div class="card-body" id="card-body">
					<h5 class="card-title text-white" >搜尋結果</h5>
					<table class="table table-light table-striped mt-2 mb-2">
					<thead class="table table-light">		
						<tr>
							<th scope="col">項目</th>
							<th scope="col">數值</th>
							<th scope="col">採驗/實際檢查日期</th>
							<th scope="col">來源</th>
						</tr>
					</thead>
					<tbody>	  
					`	
		let source=""
		for(let i=0 ; i < search_result.length ; i++ ){
			source = search_result[i]['來源'].split('\n')[0]
			card_HTML+= `
			<tr class="bg-light">
				<td scope="col">${search_result[i]['檢查檢驗\n項目']}</td>
				<td scope="col">${search_result[i]['檢查檢驗結果/\n報告結果/\n病理發現及診斷']}</td>
				<td scope="col">${search_result[i]['採驗/實際\n檢查日期▼']}</td>
				<td scope="col">${source}</td>
			</tr>
			`
		}			
		card_HTML+=`</tbody></table></div></div>`
		let div_search_result=document.createElement('div')
		div_search_result.innerHTML=card_HTML
		target.appendChild(div_search_result)
	}	
}

function warning(target, msg){
	console.log(msg)
	let list_row = document.createElement('li')
	list_row.classList.add('list-group-item', 'list-group-item-danger')
	list_row.innerHTML=msg
	target.appendChild(list_row)
}