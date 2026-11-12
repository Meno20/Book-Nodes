
// ----- Loading XML cataloge file -----//
async function loadXML(){
	try{
		const response = await fetch('books.xml');
		const text = await response.text();
		const parser = new DOMParser();
		return parser.parseFromString(text,'text/xml');
	}catch(err){
		console.error('Error loading XML:',err);
		return null;
	}
}

// ----- Get quantity status -----//
function getQuantityStatus(qty){
	if(qty == 0) return{text: 'Out of Stock', class:'out-stock'};
	if(qty < 5) return{text: 'Low Stock', class:'low-stock'};
	return{text: 'In Stock', class:'in-stock'};
}

// ----- Display Full catalog -----//
async function displayCatalog(filterCategory = 'All'){
	const xml = await loadXML();
	if(!xml) return;
	
	const books = xml.getElementsByTagName('book');
	const grid = document.getElementById('bookGrid');
	grid.innerHTML = '';
	
	for(let i = 0; i < books.length; i++){
		const category = books[i].getAttribute('category');
		if(filterCategory !== 'All' && category !== filterCategory) continue;
		
		const code = books[i].getElementsByTagName('code')[0].textContent;
		const name = books[i].getElementsByTagName('name')[0].textContent;
		const qty = books[i].getElementsByTagName('quantity')[0].textContent;
		const price = parseFloat(books[i].getElementsByTagName('unitPrice')[0].textContent);
		let imgUrl = 'https://placehold.co/150x150/cccccc/000000?text=No+Cover';
		const imgNode = books[i].getElementsByTagName('image')[0];
		if(imgNode){
			imgUrl = imgNode.textContent;
		}
		const stock = getQuantityStatus(qty);
		
		grid.innerHTML += `
			<div class="book-card">
			<img src"${imgUrl}" class="book-cover" alt="${name}">
				<div class="book-cover">${name}</div>
				<span class="category-tag">${category}</span>
				<div class="book-title">${name}</div>
				<div class="book-code">${code}</div>
				<div class="book-price">£${price.toFixed(2)}</div>
				<span class="stock-badge ${stock.class}">${stock.text}</span>
			</div>
		`;
	}
	
	if(grid.innerHTML === ''){
		grid.innerHTML = '<p>No books found in this category.</p>';
	}
}

// ----- Filter by category ----- //
function filterByCategory(category, element){
	document.querySelectorAll('.side-bar a').forEach(a => {a.classList.remove('active')});
	element.classList.add('active');
	displayCatalog(category);
}

// ----- Search by code -----//
async function searchBook(){
	const input = document.getElementById('searchInput').value.trim();
	const resultDiv = document.getElementById('searchResults');

	if(!input){
		resultDiv.innerHTML = `
			<div class="error-card">
				<h3> Please enter a book code</h3>
				<p>Example:101-05</p>
			</div>
			`;
		return;
	}

	//Validate format ###-##
	const pattern = /^\d{3}-\d{2}$/;
	if(!pattern.test(input)){
		resultDiv.innerHTML = 
			`<div class="error-card">
				<h3>Invalid Code Format</h3>
				<p>Book codes must follow the format <strong>###-##</strong>(e.g., 101-05).</p>
			</div>`;
		return;
	}

	const xml = await loadXML();
	if(!xml) return;

	const books = xml.getElementsByTagName('book');
	let found = null;

	for(let i = 0; i < books.length; i++){
		const code = books[i].getElementsByTagName('code')[0].textContent;
		if(code === input){
			found = books[i];
			break;
		}
	}
	if (found){
		const category = found.getAttribute('category');
		const code = found.getElementsByTagName('code')[0].textContent;
		const name = found.getElementsByTagName('name')[0].textContent;
		const desc = found.getElementsByTagName('description')[0].textContent;
		const qty = found.getElementsByTagName('quantity')[0].textContent;
		const price = parseFloat(found.getElementsByTagName('unitPrice')[0].textContent);
		const stock = getQuantityStatus(qty);

		resultDiv.innerHTML = `
			<p class="result-label">MATCH FOUND / ${code}</p>
			<div class="result-card">
				<div class="result-cover">
					<div style="font-size:10px;letter-spacing:2px;color:#c9a86a;">GREENLEAF COLLECTION</DIV>
					
					<div style="font-size:18px;margin:20px 0;">${name.toUpperCase()}</div>
					<div style="font-size:11px;color:#a896a;">BOOK CODE: ${code}</div>
				</div>
				<div class="result-details">
					<h2>${name}</h2>
					<p style="color:#5a4a2a;margin-bottom:15px;">${desc}</p>
					<span class="stock-badge ${stock.class}">${stock.text} (${qty} available)</span>
					<div class="result-meta">
						<div>
							<div class="meta-label">CATEGORY</div>
							<div class="meta-value">${category}</div>
						</div>
						<div>
							<div class="meta-label">BOOK CODE</div>
							<div class="meta-value">${code}</div>
						</div>
						<div>
							<div class="meta-label">PRICE</div>
							<div class="meta-value price-value">£ ${price.toFixed(2)}</div>
						</div>
					</div>
				</div>
			</div>`;
	}else{
		resultDiv.innerHTML = `
			<p class="result-label">NO MATCH FOUND</p>
			<div class="error-card">
				<h3>No book found with code ${input}</h3>
				<p>Check the code and try again,or browse the full catalog to find your book.</p>
				<a href="index.html">Browse full catalog</a>
			</div>`;
	}
}

// Allow enter key to trigger search
document.addEventListener('DOMContentLoaded',() => {
	const input = document.getElementById('searchInput');
	if(input){
		input.addEventListener('keypress',(e) =>{
			if(e.key === 'Enter') searchBook();
		});
	}

});

