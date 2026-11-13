
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
		let imgUrl = 'images/placeholder.jpg';
		if(books[i].getElementsByTagName('image').length > 0){
			imgUrl = books[i].getElementsByTagName('image')[0].textContent.trim();
		}
		const stock = getQuantityStatus(qty);
		
		grid.innerHTML += `
			<div class="book-card">
			<img src="${imgUrl}" class="book-cover" alt="${name}">
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
		const author = found.getElementsByTagName('author')[0].textContent;
		let imgUrl = 'images/placeholder.jpg';
		if(found.getElementsByTagName('image').length > 0){
			imgUrl = found.getElementsByTagName('image')[0].textContent.trim();
		}
		const stock = getQuantityStatus(qty);

		resultDiv.innerHTML = `
			<p class="result-label">MATCH FOUND / ${code}</p>
			<div class="result-card">
				<div class="result-cover">
					<span> A little shelf magic. We found Your book.</span>
					<span class="stock-badge ${stock.class}">${stock.text}</span>
					
				</div>
				<div class="result-body">
					<img src="${imgUrl}" class="result-cover-img" alt="${name}">
					
					<div class="result-details">
						<h2 class="result-title">${name}</h2>
						<p class="result-author">by ${author}</p>
						<p class="result-desc">${desc}</p>
					
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
				</div>
				<div class="results-footer">
					Available now. Find this title in the ${category} collection.
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

