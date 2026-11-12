
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
		const stock = getQuantityStatus(qty);
		
		grid.innerHTML += `
			<div class="book-card">
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

